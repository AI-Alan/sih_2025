from __future__ import annotations

from typing import Any
import logging

from ...config.settings import settings

# We use LangChain's ChatGoogleGenerativeAI if Gemini is configured, otherwise default CrewAI/OpenAI env
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_core.messages import SystemMessage, HumanMessage
except Exception:
    ChatGoogleGenerativeAI = None  # type: ignore
    SystemMessage = None  # type: ignore
    HumanMessage = None  # type: ignore

logger = logging.getLogger("crew.llm_provider")


def get_llm() -> Any:
    """Return an LLM instance for CrewAI Agents.
    Use LiteLLM directly with proper gemini/ prefix for CrewAI compatibility.
    """
    if settings.gemini_api_key:
        logger.debug(f"Using Gemini model for CrewAI: {settings.gemini_model}")
        # Import LiteLLM for direct usage
        try:
            import litellm
            import os
            # Set the API key in environment for LiteLLM
            os.environ["GEMINI_API_KEY"] = settings.gemini_api_key
            
            # Create a simple wrapper that uses LiteLLM with correct model format
            class GeminiLLM:
                def __init__(self):
                    self.model = f"gemini/{settings.gemini_model}"
                    
                def invoke(self, messages):
                    # Convert LangChain message format to LiteLLM format
                    litellm_messages = []
                    for msg in messages:
                        if hasattr(msg, 'content'):
                            role = 'system' if msg.__class__.__name__ == 'SystemMessage' else 'user'
                            litellm_messages.append({"role": role, "content": msg.content})
                        else:
                            litellm_messages.append(msg)
                    
                    response = litellm.completion(
                        model=self.model,
                        messages=litellm_messages,
                        temperature=0.4,
                        max_tokens=256
                    )
                    
                    # Return in expected format
                    class Response:
                        def __init__(self, content):
                            self.content = content
                    
                    return Response(response.choices[0].message.content)
            
            return GeminiLLM()
            
        except Exception as e:
            logger.warning(f"Failed to create LiteLLM Gemini client: {e}")
            return None
    
    # Fallback to default CrewAI behavior (OpenAI via env OPENAI_API_KEY)
    logger.warning("Gemini not available (missing key). CrewAI may fallback to OpenAI via LiteLLM.")
    return None


def generate_text(system_prompt: str, user_message: str) -> str:
    """Direct, single-shot generation using LiteLLM with Gemini.
    Returns empty string if LLM not available so callers can decide next steps.
    """
    if not settings.gemini_api_key:
        logger.warning("generate_text(): Gemini API key not available; returning empty string")
        return ""
    
    try:
        import litellm
        import os
        # Set the API key in environment for LiteLLM
        os.environ["GEMINI_API_KEY"] = settings.gemini_api_key
        
        messages = [
            {"role": "system", "content": system_prompt.strip()},
            {"role": "user", "content": user_message.strip()}
        ]
        
        response = litellm.completion(
            model=f"gemini/{settings.gemini_model}",
            messages=messages,
            temperature=0.4,
            max_tokens=256
        )
        
        text = (response.choices[0].message.content or "").strip()
        logger.debug(f"generate_text(): Got response from Gemini: {len(text)} chars")
        return text
        
    except Exception as e:
        logger.exception(f"generate_text(): Gemini call failed: {e}")
        return ""
