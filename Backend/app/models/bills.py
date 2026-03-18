from app.database import Base
from sqlalchemy import Column, DateTime, ForeignKey, Numeric, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid


class Bill(Base):
    __tablename__ = "bills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id"), nullable=False)

    title = Column(String(120), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)

    paid_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    isScanned = Column(Boolean, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    group = relationship("Group", back_populates="bills")

    items = relationship(
        "BillItem",
        back_populates="bill",
        cascade="all, delete-orphan",
    )

    splits = relationship(
        "BillSplit",
        cascade="all, delete-orphan",
    )

    payments = relationship(
        "BillPayment",
        cascade="all, delete-orphan",
    )
