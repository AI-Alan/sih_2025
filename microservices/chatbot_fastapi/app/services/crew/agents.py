from __future__ import annotations

from typing import Optional, Dict, Any

from crewai import Agent, Task, Crew

from ..memory import get_student_profile, get_history
from ..vector_memory import vector_memory
from ...config.settings import settings
from .llm_provider import get_llm


def _base_agent(description: str) -> Agent:
    llm = get_llm()
    return Agent(
        role="Supportive Coach",
        goal="Provide empathetic, practical guidance without diagnosis",
        backstory=description,
        allow_delegation=False,
        verbose=False,
        llm=llm,
    )


def stress_agent() -> Agent:
    return _base_agent(
        "Compassionate coach for stress management. Promotes breathing, breaks, and healthy routines."
    )


def burnout_agent() -> Agent:
    return _base_agent(
        "Supportive mentor for burnout. Encourages boundaries, micro‑rest, and sustainable habits."
    )


def career_agent() -> Agent:
    return _base_agent(
        "Career coach for students. Offers structured steps on skills, internships, and projects."
    )


def relationships_agent() -> Agent:
    return _base_agent(
        "Respectful relationship counselor. Promotes healthy communication, consent, and boundaries."
    )


def build_task(agent: Agent, student_id: str, message: str, domain: Optional[str]) -> Task:
    profile = get_student_profile(student_id) or {}
    history = get_history(student_id, limit=4)
    history_text = "\n".join([f"{r}:{c}" for r, c in history])
    
    # Debug logging to see what's happening with memory
    print(f"DEBUG: student_id={student_id}, history_count={len(history)}")
    if history:
        print(f"DEBUG: Recent history: {history[-2:] if len(history) >= 2 else history}")
    retrieved = vector_memory.query(student_id=student_id, domain=domain, text=message, top_k=2)
    retrieved_context = f"\n\nRelevant prior notes:\n{chr(10).join([f'- {it.text}' for it in retrieved])}" if retrieved else ""

    task_description = f"""
Follow these rules strictly:
- Be empathetic and supportive.
- Do NOT diagnose or replace professional care.
- Keep responses concise and student-friendly.
- Only provide practical suggestions when the user is asking for help or expressing distress.
- If the user is just chatting or asking questions, respond naturally without forcing suggestions.

Student profile (JSON): {profile}

Recent history (role:content):
{history_text}

{retrieved_context}

User: {message}

This is the expected criteria for your final answer: 
- A natural, empathetic response that directly addresses what the user said
- If the user seems to need help or is expressing distress, include 2-3 practical, contextual suggestions
- If the user is just chatting or asking questions, respond conversationally without suggestions
- Be genuine and avoid formulaic responses

you MUST return the actual complete content as the final answer, not a summary.
"""

    return Task(
        description=task_description,
        expected_output="A natural, empathetic response that addresses the user appropriately, with suggestions only when needed.",
        agent=agent,
    )


def run_crew(student_id: str, message: str, domain: Optional[str]) -> str:
    domain = domain or "stress"
    if domain == "stress":
        a = stress_agent()
    elif domain == "burnout":
        a = burnout_agent()
    elif domain == "career":
        a = career_agent()
    else:
        a = relationships_agent()

    task = build_task(a, student_id, message, domain)
    crew = Crew(agents=[a], tasks=[task], verbose=False)
    result = crew.kickoff()
    return str(result).strip() if result else "I'm here for you. Tell me more about what's going on." 
