from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
import datetime

Base = declarative_base()

class Tenant(Base):
    __tablename__ = 'tenants'
    
    id = Column(String, primary_key=True)  # unique string ID, e.g. "t-1"
    name = Column(String, nullable=False)
    wellness_center_name = Column(String, nullable=False)
    coach_phone_number = Column(String, nullable=True)
    role = Column(String, default="Lead Wellness Coach")
    wellness_center_address = Column(Text, nullable=True)
    
    # Active Status & Authentication
    is_active = Column(Boolean, default=False)
    username = Column(String, default="demo")
    password = Column(String, default="demo1234")
    current_session_id = Column(String, nullable=True)  # Token representing current active session
    
    clients = relationship("Client", back_populates="tenant", cascade="all, delete-orphan")


class Client(Base):
    __tablename__ = 'clients'
    
    id = Column(String, primary_key=True)
    tenant_id = Column(String, ForeignKey('tenants.id'), nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    status = Column(String, default="Lead")  # "Lead" or "Active"
    age = Column(Integer, default=30)
    gender = Column(String, default="Male")
    weight = Column(Float, default=70.0)
    height = Column(Float, default=170.0)
    visceral_fat = Column(Integer, default=5)
    subcutaneous_fat = Column(Float, default=15.0)
    bmi = Column(Float, default=24.2)
    body_fat = Column(Float, default=20.0)
    muscle_mass = Column(Float, default=30.0)
    bmr = Column(Integer, default=1500)
    biological_age = Column(Integer, default=30)
    notes = Column(Text, nullable=True)
    flagged = Column(Boolean, default=False)
    health_issues = Column(JSON, default=list)  # list of symptoms e.g., ["Thyroid", "Knee Pains"]
    health_issues_others = Column(String, default="")
    history = Column(JSON, default=list)  # list of checkups, e.g. [{"date": "2026-05-28", "weight": 84.5, "bmi": 27.6, "bmr": 1762, "bioAge": 35, "visceralFat": 12, "bodyFat": 28.5, "muscleMass": 32.4, "notes": "..."}]
    before_photo = Column(Text, nullable=True)  # Base64 string for before photo
    after_photo = Column(Text, nullable=True)   # Base64 string for after photo
    lead_type = Column(String, default="offline") # "online" or "offline"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    converted_at = Column(String, nullable=True)  # Timestamp when client converted to Active status
    
    tenant = relationship("Tenant", back_populates="clients")


class ClientResult(Base):
    __tablename__ = 'client_results'
    
    id = Column(String, primary_key=True)
    client_id = Column(String, ForeignKey('clients.id'), nullable=True)
    tenant_id = Column(String, ForeignKey('tenants.id'), nullable=False)
    client_name = Column(String, nullable=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    type = Column(String, nullable=False)
    link = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    added_at = Column(DateTime, default=datetime.datetime.utcnow)

