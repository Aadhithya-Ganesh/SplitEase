from typing import Annotated
from fastapi import APIRouter, Depends
from app.models.user import User
from app.routes.auth import get_current_user

router = APIRouter(prefix="/api/bill", tags=["bill"])

@router.get("/get")
async def get(token: Annotated[User, Depends(get_current_user)]):
    return token