from app.database import Base
from sqlalchemy import Column, Enum, String, Numeric, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid


class BillItem(Base):
    __tablename__ = "bill_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    bill_id = Column(
        UUID(as_uuid=True),
        ForeignKey("bills.id", ondelete="CASCADE"),
        nullable=False,
    )

    name = Column(String(100), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    split_mode = Column(
        Enum("equal", "percentage", name="split_mode"),
        default="equal",
        nullable=False,
    )

    bill = relationship("Bill", back_populates="items")
    splits = relationship(
        "BillSplit",
        cascade="all, delete-orphan",
    )
