# ManMitra Chatbot FastAPI Microservice

FastAPI microservice to power the ManMitra mental-health chatbot focusing on:
- Stress
- Burnout
- Career guidance
- Relationships

It persists per-student memory (structured profile + conversation history) and is designed to integrate with CrewAI later. For now, it provides a safe, offline fallback response generator.

## Structure

```
microservices/chatbot_fastapi/
  app/
    config/settings.py
    main.py
    routers/
      health.py
      chat.py
    schemas/
      chat.py
    services/
      memory.py
      agent.py
  requirements.txt
  README.md
```

## Setup

1. Create a virtual environment and install dependencies:

```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Create a `.env` in repo root or set environment variables:

```
ENV=development
CHATBOT_HOST=0.0.0.0
CHATBOT_PORT=8091
# Secure Express-to-microservice requests
CHATBOT_API_KEY=change-me
# CORS
CORS_ALLOW_ORIGINS=*
# Optional CrewAI/OpenAI (not required for fallback)
# OPENAI_API_KEY=sk-...
# CREWAI_ENABLED=true
```

## Run

```
uvicorn app.main:app --host 0.0.0.0 --port 8091 --reload
```

Health check:

```
curl http://localhost:8091/health/ping
```

Chat example:

```
curl -X POST http://localhost:8091/chat/ \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: change-me' \
  -d '{
    "student_id": "s123",
    "message": "I feel overwhelmed with exams",
    "domain": "stress",
    "update_profile": {"branch": "CSE", "year": 2}
  }'
```

## Notes
- SQLite DB is created at `microservices/chatbot_fastapi/data/chatbot.db` by default.
- Memory includes `students` (profile) and `messages` (conversation) tables.
- CrewAI integration is stubbed in `app/services/agent.py` and can be wired to actual agents later.
