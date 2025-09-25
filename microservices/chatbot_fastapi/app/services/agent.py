from typing import Dict, Any, List, Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor

from ..config.settings import settings
from .memory import get_history, get_student_profile
from .vector_memory import vector_memory
from .crew.agents import run_crew
from .crew.llm_provider import generate_text

DOMAIN_SYSTEM_PROMPTS: Dict[str, str] = {
    "stress": (
        "You are a compassionate mental health coach focused on stress. "
        "Listen empathetically, validate feelings, avoid diagnoses, and suggest practical, low-risk coping strategies."
    ),
    "burnout": (
        "You are a supportive mentor helping with burnout. "
        "Encourage boundaries, rest, micro-habits, and seeking professional help if needed."
    ),
    "career": (
        "You are a career guidance coach for students. "
        "Offer structured advice on skills, internships, projects, and planning next steps."
    ),
    "relationships": (
        "You are a respectful relationship counselor. "
        "Promote healthy communication, consent, and personal boundaries."
    ),
}

FALLBACK_SUGGESTIONS: Dict[str, List[str]] = {
    "stress": [
        "Try a 4-7-8 breathing cycle for 2 minutes",
        "Take a short walk and hydrate",
        "Break tasks into 25-minute focus blocks (Pomodoro)",
    ],
    "burnout": [
        "Schedule a 5-minute break between long study sessions",
        "List top 3 priorities for the day",
        "Reach out to a friend or mentor for a quick check-in",
    ],
    "career": [
        "Shortlist 3 roles and map required skills",
        "Draft a 1-page resume and get feedback",
        "Apply to 2 internships this week",
    ],
    "relationships": [
        "Use I-statements to express feelings respectfully",
        "Schedule time to talk without distractions",
        "Reflect on boundaries and needs before the conversation",
    ],
}

class ChatAgent:
    def __init__(self):
        self.crewai_enabled = settings.crewai_enabled and bool(settings.gemini_api_key)
        # If integrating CrewAI in future, initialize crew, agents, tasks here based on domain.
        self._executor = ThreadPoolExecutor(max_workers=4)

    def _build_context(self, student_id: str, message: str, domain: Optional[str]) -> Dict[str, Any]:
        profile = get_student_profile(student_id) or {}
        history = get_history(student_id, limit=4)  # trimmed for speed
        retrieved = vector_memory.query(student_id=student_id, domain=domain, text=message, top_k=2)
        retrieved_txt = "\n".join([f"- {it.text}" for it in retrieved]) if retrieved else ""
        system = DOMAIN_SYSTEM_PROMPTS.get(domain or "stress", DOMAIN_SYSTEM_PROMPTS["stress"])
        prompt = (
            f"{system}\n\n"
            f"Follow these rules strictly:\n"
            f"- Be empathetic and supportive.\n"
            f"- Do NOT diagnose or replace professional care.\n"
            f"- Offer 2-4 practical, low-risk suggestions.\n"
            f"- Keep responses concise and student-friendly.\n\n"
            f"Student profile (JSON): {profile}\n\n"
            f"Recent history (role:content):\n" + "\n".join([f"{r}:{c}" for r, c in history])
            + (f"\n\nRelevant prior notes:\n{retrieved_txt}\n" if retrieved_txt else "")
        )
        return {"profile": profile, "history": history, "retrieved_txt": retrieved_txt, "system": system, "prompt": prompt}

    def _simple_generate(self, student_id: str, message: str, domain: Optional[str]) -> Dict[str, Any]:
        # Lightweight, safe fallback that does NOT expose internal system prompts
        history = get_history(student_id, limit=6)
        # Retrieve semantically similar past context (short)
        retrieved = vector_memory.query(student_id=student_id, domain=domain, text=message, top_k=2)
        context_note = "I remember a few things you've shared before." if retrieved else ""
        reply = (
            f"Thanks for sharing. I hear you — that can be a lot to carry. {context_note}\n\n"
            f"Here are a few gentle ideas you can try right now:"
        )
        suggestions = FALLBACK_SUGGESTIONS.get(domain or "stress", [])
        return {"reply": reply, "suggestions": suggestions}

    def respond(self, student_id: str, message: str, domain: Optional[str]) -> Dict[str, Any]:
        # Try CrewAI with retries + timeout, then fallback to direct LLM using same context
        if not self.crewai_enabled:
            return {"reply": "Chat service is not fully configured. Please enable CREWAI in settings.", "suggestions": []}

        ctx = self._build_context(student_id, message, domain)
        attempts = 3  # 2 retries
        timeout_s = 15
        last_err: Optional[Exception] = None
        for _ in range(attempts):
            try:
                # Run crew in a thread and wait with timeout (no event loop usage here)
                future = self._executor.submit(run_crew, student_id, message, domain)
                text = future.result(timeout=timeout_s)
                # No hardcoded suggestions - AI will include them in response when appropriate
                return {"reply": text, "suggestions": []}
            except Exception as e:
                last_err = e
                continue

        # Fallback: direct LLM single-shot with the same context
        text = generate_text(system_prompt=ctx["prompt"], user_message=message)
        if text:
            # No hardcoded suggestions - AI will include them in response when appropriate
            return {"reply": text, "suggestions": []}
        # If LLM also not available, use minimal safe fallback
        return self._simple_generate(student_id, message, domain)

    async def respond_stream(self, student_id: str, message: str, domain: Optional[str]):
        """Async generator that yields streaming chunks for the UI.
        We yield small status updates while CrewAI runs, then final text (or fallback) when ready.
        """
        yield "data: typing\n\n"
        if not self.crewai_enabled:
            yield "data: Chat service is not fully configured. Please enable CREWAI in settings.\n\n"
            yield "event: end\n\n"
            return

        loop = asyncio.get_event_loop()
        ctx = self._build_context(student_id, message, domain)

        async def run_crew_async():
            return await loop.run_in_executor(self._executor, run_crew, student_id, message, domain)

        # Try crew with timeout
        try:
            text = await asyncio.wait_for(run_crew_async(), timeout=15)
            yield f"data: {text}\n\n"
            yield "event: end\n\n"
            return
        except Exception:
            pass

        # Fallback to direct LLM
        text = generate_text(system_prompt=ctx["prompt"], user_message=message)
        if text:
            yield f"data: {text}\n\n"
            yield "event: end\n\n"
            return
        # Final minimal fallback
        fallback = self._simple_generate(student_id, message, domain)["reply"]
        yield f"data: {fallback}\n\n"
        yield "event: end\n\n"

agent = ChatAgent()
