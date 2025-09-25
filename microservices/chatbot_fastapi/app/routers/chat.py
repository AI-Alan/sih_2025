from fastapi import APIRouter, Depends, Header, HTTPException
from typing import Optional
from fastapi.responses import StreamingResponse

from ..config.settings import settings
from ..schemas.chat import ChatRequest, ChatResponse
from ..services import memory
from ..services.agent import agent
from ..services.vector_memory import vector_memory

router = APIRouter()


def verify_api_key(x_api_key: Optional[str] = Header(None)):
    if settings.api_key and x_api_key != settings.api_key:
        raise HTTPException(status_code=401, detail="Invalid API key")

@router.post("/", response_model=ChatResponse, dependencies=[Depends(verify_api_key)])
async def chat(req: ChatRequest) -> ChatResponse:
    # Persist profile updates first if provided
    memory_updated = False
    profile = memory.get_student_profile(req.student_id)
    if req.update_profile:
        profile.update(req.update_profile)
        memory.upsert_student_profile(req.student_id, profile)
        memory_updated = True

    # Determine effective domain (use last saved if not provided)
    effective_domain: Optional[str] = req.domain or profile.get("last_domain") if isinstance(profile, dict) else req.domain
    # Update last_domain in profile when domain is provided or resolved
    if effective_domain and (not isinstance(profile, dict) or profile.get("last_domain") != effective_domain):
        if not isinstance(profile, dict):
            profile = {}
        profile["last_domain"] = effective_domain
        memory.upsert_student_profile(req.student_id, profile)
        memory_updated = True

    # Store user message
    memory.add_message(req.student_id, "user", req.message)
    # Upsert into vector memory for semantic recall
    vector_memory.upsert(student_id=req.student_id, role="user", text=req.message, domain=effective_domain)

    # Get agent response
    result = agent.respond(req.student_id, req.message, effective_domain)
    reply_text = result.get("reply", "")

    # Store assistant message
    memory.add_message(req.student_id, "assistant", reply_text)
    vector_memory.upsert(student_id=req.student_id, role="assistant", text=reply_text, domain=effective_domain)

    return ChatResponse(
        reply=reply_text,
        memory_updated=memory_updated,
        domain=effective_domain,
        suggestions=result.get("suggestions"),
    )


@router.get("/stream", dependencies=[Depends(verify_api_key)])
async def chat_stream(student_id: str, message: str, domain: Optional[str] = None):
    async def event_generator():
        async for chunk in agent.respond_stream(student_id=student_id, message=message, domain=domain):
            yield chunk
    return StreamingResponse(event_generator(), media_type="text/event-stream")
