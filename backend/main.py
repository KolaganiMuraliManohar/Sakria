from fastapi import FastAPI, Request, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy import text
from sqlalchemy.orm import Session
from backend.models import Tenant, Client
from backend.database import get_db, init_db
import uuid
import os

app = FastAPI(title="Sakria Wellness Operator Platform Backend")

# Enable CORS for web dev servers and production domains
cors_origins_env = os.environ.get("CORS_ORIGINS", "")
if cors_origins_env:
    allowed_origins = [orig.strip() for orig in cors_origins_env.split(",") if orig.strip()]
else:
    allowed_origins = [
        "http://127.0.0.1:8080",
        "http://localhost:8080"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # Initialize SQLite database and load initial mock data on startup
    init_db()

# ── 1. DATA FEEDS ENDPOINTS FOR DASHBOARD & INBOX ──

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(request: Request, tenant_id: str = "t-1", db: Session = Depends(get_db)):
    session_token = request.headers.get("X-Session-Token")
    check_session(db, tenant_id, session_token)
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
        
    return {
        "credits": 0,
        "total_sent": 0,
        "total_delivered": 0,
        "total_spent_inr": 0.0,
        "center_name": tenant.wellness_center_name,
        "whatsapp_business_number": tenant.coach_phone_number,
        "whatsapp_configured": False,
        "coach_name": tenant.name,
        "coach_email": tenant.username,
        "coach_username": tenant.username,
        "role": tenant.role,
        "wellness_center_address": tenant.wellness_center_address
    }

@app.get("/api/inbox")
async def get_inbox_data(request: Request, tenant_id: str = "t-1", db: Session = Depends(get_db)):
    session_token = request.headers.get("X-Session-Token")
    check_session(db, tenant_id, session_token)
    clients = db.query(Client).filter(Client.tenant_id == tenant_id).all()
    inbox = []
    
    for c in clients:
        inbox.append({
            "client_id": c.id,
            "name": c.name,
            "phone": c.phone,
            "status": c.status,
            "age": c.age,
            "gender": c.gender,
            "weight": c.weight,
            "height": c.height,
            "visceral_fat": c.visceral_fat,
            "subcutaneous_fat": c.subcutaneous_fat,
            "bmi": c.bmi,
            "body_fat": c.body_fat,
            "muscle_mass": c.muscle_mass,
            "bmr": c.bmr,
            "biological_age": c.biological_age,
            "notes": c.notes,
            "flagged": c.flagged,
            "health_issues": c.health_issues,
            "health_issues_others": c.health_issues_others,
            "history": c.history or [],
            "before_photo": c.before_photo,
            "after_photo": c.after_photo,
            "lead_type": c.lead_type or "offline",
            "created_at": c.created_at.isoformat() if c.created_at else None,
            "converted_at": c.converted_at,
            "messages": []
        })
        
    return inbox


ACTIVE_ADMIN_SESSION_ID = None

def check_session(db: Session, tenant_id: str, session_token: str):
    if tenant_id == "admin":
        if not session_token or session_token != ACTIVE_ADMIN_SESSION_ID:
            raise HTTPException(status_code=401, detail="Session expired: Account logged in from another device.")
        return
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    if not tenant.is_active:
        raise HTTPException(status_code=403, detail="Your coach account has been deactivated/paused by the administrator. Contact support@sakria.in.")
    if tenant.current_session_id:
        if not session_token or session_token != tenant.current_session_id:
            raise HTTPException(status_code=401, detail="Session expired: Account logged in from another device.")

# ── 2. SECURE AUTHENTICATION ENDPOINTS ──

@app.post("/api/auth/login")
async def secure_login(payload: dict, db: Session = Depends(get_db)):
    username = payload.get("username", "").strip()
    password = payload.get("password", "").strip()
    
    # Check Super Admin Master Credentials
    admin_password = os.environ.get("ADMIN_PASSWORD", "sakria_admin_2026")
    if username == "admin" and password == admin_password:
        global ACTIVE_ADMIN_SESSION_ID
        session_id = str(uuid.uuid4())
        ACTIVE_ADMIN_SESSION_ID = session_id
        return {
            "success": True,
            "is_admin": True,
            "tenant_id": "admin",
            "session_id": session_id,
            "is_active": True,
            "name": "Platform Owner",
            "center_name": "Sakria Master Console"
        }
        
    # Check tenant operators database records
    tenant = db.query(Tenant).filter(Tenant.username == username).first()
    if not tenant:
        raise HTTPException(status_code=400, detail="Invalid username or password.")
        
    if tenant.password != password:
        raise HTTPException(status_code=400, detail="Invalid username or password.")
        
    if not tenant.is_active:
        raise HTTPException(status_code=400, detail="Your coach account has been deactivated/paused by the administrator. Contact support@sakria.in.")
        
    session_id = str(uuid.uuid4())
    tenant.current_session_id = session_id
    db.commit()
    
    return {
        "success": True,
        "is_admin": False,
        "tenant_id": tenant.id,
        "session_id": session_id,
        "is_active": tenant.is_active,
        "name": tenant.name,
        "center_name": tenant.wellness_center_name
    }


# ── 3. CLIENT CRUD PERSISTENCE ENDPOINTS ──

@app.post("/api/clients")
async def create_client(request: Request, payload: dict, db: Session = Depends(get_db)):
    session_token = request.headers.get("X-Session-Token")
    tenant_id = payload.get("tenant_id", "t-1")
    check_session(db, tenant_id, session_token)
    client_id = payload.get("id") or f"c-{uuid.uuid4().hex[:8]}"
    name = payload.get("name")
    phone = payload.get("phone")
    if not name or not phone:
        raise HTTPException(status_code=400, detail="Name and phone are required parameters.")
        
    client = Client(
        id=client_id,
        tenant_id=tenant_id,
        name=name,
        phone=phone,
        status=payload.get("status", "Lead"),
        age=int(payload.get("age", 30)),
        gender=payload.get("gender", "Male"),
        weight=float(payload.get("weight", 70.0)),
        height=float(payload.get("height", 170.0)),
        visceral_fat=int(payload.get("visceralFat", 5)),
        subcutaneous_fat=float(payload.get("subcutaneousFat", 15.0)),
        bmi=float(payload.get("bmi", 24.2)),
        body_fat=float(payload.get("bodyFat", 20.0)),
        muscle_mass=float(payload.get("muscleMass", 30.0)),
        bmr=int(payload.get("bmr", 1500)),
        biological_age=int(payload.get("biologicalAge", 30)),
        notes=payload.get("notes", ""),
        flagged=payload.get("flagged", False),
        health_issues=payload.get("healthIssues", []),
        health_issues_others=payload.get("healthIssuesOthers", ""),
        history=payload.get("history", []),
        before_photo=payload.get("before_photo") or payload.get("beforePhoto"),
        after_photo=payload.get("after_photo") or payload.get("afterPhoto"),
        lead_type=payload.get("lead_type") or payload.get("leadType") or "offline",
        converted_at=payload.get("convertedAt") or payload.get("converted_at")
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return {"success": True, "client_id": client.id}

@app.put("/api/clients/{client_id}")
async def update_client_endpoint(request: Request, client_id: str, payload: dict, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")
        
    session_token = request.headers.get("X-Session-Token")
    check_session(db, client.tenant_id, session_token)
    
    if "name" in payload: client.name = payload["name"]
    if "phone" in payload: client.phone = payload["phone"]
    if "status" in payload: client.status = payload["status"]
    if "age" in payload: client.age = int(payload["age"])
    if "gender" in payload: client.gender = payload["gender"]
    if "weight" in payload: client.weight = float(payload["weight"])
    if "height" in payload: client.height = float(payload["height"])
    if "visceralFat" in payload: client.visceral_fat = int(payload["visceralFat"])
    if "subcutaneousFat" in payload: client.subcutaneous_fat = float(payload["subcutaneousFat"])
    if "bmi" in payload: client.bmi = float(payload["bmi"])
    if "bodyFat" in payload: client.body_fat = float(payload["bodyFat"])
    if "muscleMass" in payload: client.muscle_mass = float(payload["muscleMass"])
    if "bmr" in payload: client.bmr = int(payload["bmr"])
    if "biologicalAge" in payload: client.biological_age = int(payload["biologicalAge"])
    if "notes" in payload: client.notes = payload["notes"]
    if "flagged" in payload: client.flagged = payload["flagged"]
    if "healthIssues" in payload: client.health_issues = payload["healthIssues"]
    if "healthIssuesOthers" in payload: client.health_issues_others = payload["healthIssuesOthers"]
    if "history" in payload: client.history = payload["history"]
    if "before_photo" in payload: client.before_photo = payload["before_photo"]
    if "beforePhoto" in payload: client.before_photo = payload["beforePhoto"]
    if "after_photo" in payload: client.after_photo = payload["after_photo"]
    if "afterPhoto" in payload: client.after_photo = payload["afterPhoto"]
    if "lead_type" in payload: client.lead_type = payload["lead_type"]
    if "leadType" in payload: client.lead_type = payload["leadType"]
    if "converted_at" in payload: client.converted_at = payload["converted_at"]
    if "convertedAt" in payload: client.converted_at = payload["convertedAt"]
    
    db.commit()
    return {"success": True, "client_id": client.id}

@app.delete("/api/clients/{client_id}")
async def delete_client_endpoint(request: Request, client_id: str, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")
        
    session_token = request.headers.get("X-Session-Token")
    check_session(db, client.tenant_id, session_token)
    
    db.delete(client)
    db.commit()
    return {"success": True}


# ── 4. SUPER ADMIN CONTROL PANEL ENDPOINTS ──

@app.get("/api/admin/tenants")
async def get_all_tenants(request: Request, db: Session = Depends(get_db)):
    session_token = request.headers.get("X-Session-Token")
    check_session(db, "admin", session_token)
    tenants = db.query(Tenant).all()
    results = []
    for t in tenants:
        results.append({
            "id": t.id,
            "name": t.name,
            "wellness_center_name": t.wellness_center_name,
            "coach_phone_number": t.coach_phone_number,
            "role": t.role,
            "whatsapp_configured": False,
            "whatsapp_business_number": t.coach_phone_number,
            "credits": 0,
            "is_active": t.is_active,
            "email": t.username,
            "username": t.username,
            "password": t.password
        })
    return results

@app.post("/api/admin/tenants/toggle-status")
async def toggle_tenant_status(request: Request, payload: dict, db: Session = Depends(get_db)):
    session_token = request.headers.get("X-Session-Token")
    check_session(db, "admin", session_token)
    tenant_id = payload.get("tenant_id")
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
        
    tenant.is_active = not tenant.is_active
    db.commit()
    return {"success": True, "is_active": tenant.is_active}

@app.post("/api/admin/tenants/kill-switch")
async def global_kill_switch(request: Request, payload: dict, db: Session = Depends(get_db)):
    session_token = request.headers.get("X-Session-Token")
    check_session(db, "admin", session_token)
    deactivate_all = payload.get("deactivate_all", True)
    tenants = db.query(Tenant).all()
    for t in tenants:
        t.is_active = False if deactivate_all else True
    db.commit()
    return {"success": True, "message": "All tenants paused successfully!" if deactivate_all else "All tenants activated successfully!"}

@app.post("/api/admin/tenants/register")
async def register_new_tenant(request: Request, payload: dict, db: Session = Depends(get_db)):
    session_token = request.headers.get("X-Session-Token")
    check_session(db, "admin", session_token)
    tenant_id = payload.get("tenant_id", "").strip()
    name = payload.get("name", "").strip()
    center_name = payload.get("center_name", "").strip()
    username = payload.get("username", payload.get("email", "")).strip()  # Allow fallback during transitions
    password = payload.get("password", "").strip()
    
    coach_phone_number = payload.get("coach_phone_number", "").strip()
    role = payload.get("role", "Lead Wellness Coach").strip()
    wellness_center_address = payload.get("wellness_center_address", "").strip()
    
    if not tenant_id or not name or not center_name or not username or not password:
        raise HTTPException(status_code=400, detail="All registration parameters must be provided!")
        
    # Check uniqueness
    existing_tenant = db.query(Tenant).filter((Tenant.id == tenant_id) | (Tenant.username == username)).first()
    if existing_tenant:
        raise HTTPException(status_code=400, detail="Tenant ID or Username already registered!")
        
    new_tenant = Tenant(
        id=tenant_id,
        name=name,
        wellness_center_name=center_name,
        coach_phone_number=coach_phone_number if coach_phone_number else None,
        role=role if role else "Lead Wellness Coach",
        wellness_center_address=wellness_center_address if wellness_center_address else None,
        username=username,
        password=password,
        is_active=True
    )
    db.add(new_tenant)
    db.commit()
    return {"success": True, "tenant_id": tenant_id}

@app.put("/api/admin/tenants/{tenant_id}")
async def update_tenant_profile(request: Request, tenant_id: str, payload: dict, db: Session = Depends(get_db)):
    session_token = request.headers.get("X-Session-Token")
    check_session(db, "admin", session_token)
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
        
    tenant.name = payload.get("name", tenant.name).strip()
    tenant.wellness_center_name = payload.get("wellness_center_name", tenant.wellness_center_name).strip()
    tenant.coach_phone_number = payload.get("coach_phone_number", tenant.coach_phone_number).strip()
    tenant.role = payload.get("role", tenant.role).strip()
    tenant.wellness_center_address = payload.get("wellness_center_address", tenant.wellness_center_address).strip()
    tenant.username = payload.get("username", payload.get("email", tenant.username)).strip()  # Allow fallback
    tenant.password = payload.get("password", tenant.password).strip()
    
    db.commit()
    return {"success": True, "tenant_id": tenant_id}

@app.get("/api/admin/system-stats")
async def get_system_stats(request: Request, db: Session = Depends(get_db)):
    session_token = request.headers.get("X-Session-Token")
    check_session(db, "admin", session_token)
    
    # Calculate stats
    total_tenants = db.query(Tenant).count()
    active_tenants = db.query(Tenant).filter(Tenant.is_active == True).count()
    total_clients = db.query(Client).count()
    
    # Active session count (excluding null/empty)
    active_sessions = db.query(Tenant).filter(Tenant.current_session_id != None).count()
    
    # Database Size (SQLite vs PostgreSQL/CockroachDB compatibility)
    db_size_kb = 0
    try:
        if db.bind.dialect.name == "sqlite":
            if os.path.exists("sakria.db"):
                db_size_kb = round(os.path.getsize("sakria.db") / 1024, 1)
        else:
            db_size_val = db.execute(text("SELECT pg_database_size(current_database()) / 1024.0")).scalar()
            db_size_kb = round(float(db_size_val), 1)
    except Exception:
        db_size_kb = "N/A"
        
    return {
        "status": "Healthy",
        "database_status": "Connected",
        "database_size_kb": db_size_kb,
        "total_tenants": total_tenants,
        "active_tenants": active_tenants,
        "total_clients": total_clients,
        "active_sessions": active_sessions
    }

# Serve Frontend SPA static assets in production
app.mount("/src", StaticFiles(directory="src"), name="src")
app.mount("/public", StaticFiles(directory="public"), name="public")

# Fallback route to serve index.html for root or SPA frontend routing
@app.get("/")
async def read_index():
    return FileResponse("index.html")

