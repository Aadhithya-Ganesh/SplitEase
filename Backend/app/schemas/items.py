from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional, Annotated


class ItemCreate(BaseModel):
    bill_id: UUID
    name: str
    amount: float
    quantity: int


class ItemUpdate(BaseModel):
    quantity: Annotated[Optional[int], Field(ge=1)] = None
    amount: Annotated[Optional[float], Field(ge=0)] = None


class ItemResponse(BaseModel):
    id: UUID
    name: str
    amount: float
    quantity: int
