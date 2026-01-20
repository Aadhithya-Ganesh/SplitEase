from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List, Literal

# =========================
# CREATE / BASIC RESPONSES
# =========================


class GroupCreate(BaseModel):
    name: str


class GroupResponse(BaseModel):
    id: UUID
    name: str
    created_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class GroupJoinResponse(BaseModel):
    group_id: UUID
    group_name: str
    role: str

    class Config:
        from_attributes = True


# =========================
# GROUP LIST (Dashboard)
# =========================


class GroupListItem(BaseModel):
    id: UUID
    name: str
    members_count: int
    balance: float  # +ve → you get, -ve → you owe

    class Config:
        from_attributes = True


# =========================
# GROUP DETAIL (Screen)
# =========================


class GroupBillItem(BaseModel):
    id: UUID
    title: str
    total_amount: float
    created_at: datetime
    paid_by: str
    pending_count: int
    user_balance: float
    status: Literal["YOU_OWE", "YOU_GET", "SETTLED"]


class GroupDetailResponse(BaseModel):
    id: UUID
    name: str
    members_count: int
    bills_count: int
    balance: float
    bills: List[GroupBillItem]
