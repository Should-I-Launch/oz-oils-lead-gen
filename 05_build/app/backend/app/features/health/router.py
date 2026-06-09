from fastapi import APIRouter

from .service import get_health_status

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
async def health():
    return get_health_status()
