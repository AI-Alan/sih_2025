from __future__ import annotations

from typing import Optional

import google.generativeai as genai

from ..config.settings import settings


def _ensure_configured():
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY not set")
    genai.configure(api_key=settings.gemini_api_key)


def gemini_generate(user_message: str, system_prompt: str, model_name: Optional[str] = None) -> str:
    """
    Generate a response using Gemini given a system prompt (instructions + context)
    and the user's latest message. Returns a plain text reply.
    """
    _ensure_configured()
    model = genai.GenerativeModel(model_name or settings.gemini_model)

    # We pass system instructions in the first part, then the user message.
    # Keep generation conservative for safety.
    parts = [
        {"text": system_prompt.strip()},
        {"text": f"User: {user_message.strip()}"},
    ]
    try:
        resp = model.generate_content(
            parts,
            safety_settings={
                # Use model defaults; can be tuned as needed
            },
            generation_config={
                "temperature": 0.6,
                "top_p": 0.9,
                "top_k": 40,
                "max_output_tokens": 512,
            },
        )
        text = (resp.text or "").strip()
        if not text:
            return "I'm here to support you. Could you share a bit more?"
        return text
    except Exception as e:
        # Fail gracefully so upstream can fallback
        raise
