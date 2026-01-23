from pydantic import BaseModel
from uuid import UUID


class ItemCreate(BaseModel):
    bill_id: UUID
    name: str
    amount: float
    quantity: int


class ItemUpdate(BaseModel):
    name: str | None = None
    amount: float
    quantity: int


class ItemResponse(BaseModel):
    id: UUID
    name: str
    amount: float
    quantity: int
