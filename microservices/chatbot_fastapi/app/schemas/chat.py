from pydantic import BaseModel, Field
from typing import Optional, Literal, List, Dict, Any

Domain = Literal["stress", "burnout", "career", "relationships"]

class ChatRequest(BaseModel):
    student_id: str = Field(..., description="Unique ID for student")
    message: str = Field(..., description="User message/question")
    domain: Optional[Domain] = Field(None, description="Conversation domain context")
    update_profile: Optional[Dict[str, Any]] = Field(None, description="Optional structured profile updates to persist")

class ChatResponse(BaseModel):
    reply: str
    memory_updated: bool = False
    domain: Optional[Domain] = None
    suggestions: Optional[List[str]] = None
