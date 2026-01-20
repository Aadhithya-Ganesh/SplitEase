from typing import Annotated
from fastapi import APIRouter, Depends
from app.models.users import Users
from app.routes.auth import get_current_user
from uuid import UUID

router = APIRouter(prefix="/api/bill", tags=["bill"])


@router.get("/{group_id}")
async def get_bills_by_group_id(user: Annotated[Users, Depends(get_current_user)], group_id: UUID):
    return user
