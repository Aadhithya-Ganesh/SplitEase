from app.database import Base
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    fullname = Column(String(56), nullable=False)
    email  = Column(String(120), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable = False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)