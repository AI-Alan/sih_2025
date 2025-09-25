from fastapi import APIRouter

router = APIRouter()

@router.get("/ping")
def ping():
    return {"status": "ok"}

@router.get("/version")
def version():
    return {"version": "0.1.0"}
