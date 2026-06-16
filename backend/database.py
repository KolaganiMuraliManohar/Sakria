import os
import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from backend.models import Base, Tenant, Client

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///sakria.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Run SQLite specific column migrations. For PG/CockroachDB, table creation uses the final schemas.
    if engine.dialect.name == "sqlite":
        try:
            with engine.begin() as connection:
                result = connection.execute(text("PRAGMA table_info(clients);")).fetchall()
                column_names = [row[1] for row in result]
                if "before_photo" not in column_names:
                    connection.execute(text("ALTER TABLE clients ADD COLUMN before_photo TEXT;"))
                    print("Added column before_photo to clients table.")
                if "after_photo" not in column_names:
                    connection.execute(text("ALTER TABLE clients ADD COLUMN after_photo TEXT;"))
                    print("Added column after_photo to clients table.")
                if "converted_at" not in column_names:
                    connection.execute(text("ALTER TABLE clients ADD COLUMN converted_at TEXT;"))
                    print("Added column converted_at to clients table.")
                
                # Check tenants table for current_session_id and username columns
                result_tenants = connection.execute(text("PRAGMA table_info(tenants);")).fetchall()
                tenant_columns = [row[1] for row in result_tenants]
                if "current_session_id" not in tenant_columns:
                    connection.execute(text("ALTER TABLE tenants ADD COLUMN current_session_id TEXT;"))
                    print("Added column current_session_id to tenants table.")
                if "username" not in tenant_columns:
                    if "email" in tenant_columns:
                        try:
                            connection.execute(text("ALTER TABLE tenants RENAME COLUMN email TO username;"))
                            print("Renamed tenants.email to tenants.username.")
                        except Exception as rename_err:
                            print("Failed to rename column, adding username column manually:", rename_err)
                            connection.execute(text("ALTER TABLE tenants ADD COLUMN username TEXT;"))
                            connection.execute(text("UPDATE tenants SET username = email;"))
                    else:
                        connection.execute(text("ALTER TABLE tenants ADD COLUMN username TEXT;"))
                        print("Added column username to tenants table.")
                
                # Clean up all existing coach usernames that contain '@'
                connection.execute(text("""
                    UPDATE tenants 
                    SET username = SUBSTR(username, 1, INSTR(username, '@') - 1)
                    WHERE username LIKE '%@%';
                """))
                print("Cleaned up coach usernames by stripping email domains.")
        except Exception as e:
            print("Database migration warning:", e)
    seed_data()

def seed_data():
    db = SessionLocal()
    
    # Check if we already have seeded data
    if db.query(Tenant).first():
        db.close()
        return

    print("Seeding default multi-tenant data...")

    # 1. Create Default Operator/Tenant (Shri Dhanvantari Wellness Center)
    tenant = Tenant(
        id="t-1",
        name="SK Coach",
        wellness_center_name="Shri Dhanvantari Wellness Center",
        coach_phone_number="+91 90001 22233",
        role="Lead Wellness Coach",
        wellness_center_address="12-4/A, Dhanvantari Avenue, Hyderabad, Telangana, India",
        is_active=True,
        username="demo",
        password="demo1234"
    )
    db.add(tenant)

    # Helper function to generate history
    date_initial_1 = (datetime.datetime.utcnow() - datetime.timedelta(days=3)).strftime("%Y-%m-%d")
    date_initial_2 = (datetime.datetime.utcnow() - datetime.timedelta(days=6)).strftime("%Y-%m-%d")
    date_initial_3 = (datetime.datetime.utcnow() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")

    # 2. Seed Clients / Leads
    c1 = Client(
        id="c-1",
        tenant_id="t-1",
        name="Arjun Rao",
        phone="9876543210",
        status="Lead",
        age=28,
        gender="Male",
        weight=84.5,
        height=175.0,
        visceral_fat=12,
        subcutaneous_fat=18.5,
        bmi=27.6,
        body_fat=28.5,
        muscle_mass=32.4,
        bmr=1762,
        biological_age=35,
        notes="Expressed concerns about lethargy and high visceral fat. Needs immediate follow-up on dietary habits.",
        flagged=True,
        health_issues=["Thyroid", "Knee Pains"],
        health_issues_others="",
        history=[
            {
                "date": date_initial_1,
                "weight": 84.5,
                "height": 175.0,
                "bmi": 27.6,
                "visceralFat": 12,
                "subcutaneousFat": 18.5,
                "bodyFat": 28.5,
                "muscleMass": 32.4,
                "bmr": 1762,
                "biologicalAge": 35,
                "notes": "Initial diagnostic checkup. Elevated visceral fat warning."
            }
        ],
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=3)
    )
    
    c2 = Client(
        id="c-2",
        tenant_id="t-1",
        name="Sarah Jenkins",
        phone="9123456789",
        status="Active",
        age=34,
        gender="Female",
        weight=62.0,
        height=162.0,
        visceral_fat=6,
        subcutaneous_fat=15.2,
        bmi=23.6,
        body_fat=24.1,
        muscle_mass=26.8,
        bmr=1320,
        biological_age=30,
        notes="Active runner, wants to optimize hydration and build lean muscle mass.",
        flagged=False,
        health_issues=["Skin Issues"],
        health_issues_others="",
        history=[
            {
                "date": date_initial_2,
                "weight": 62.0,
                "height": 162.0,
                "bmi": 23.6,
                "visceralFat": 6,
                "subcutaneousFat": 15.2,
                "bodyFat": 24.1,
                "muscleMass": 26.8,
                "bmr": 1320,
                "biologicalAge": 30,
                "notes": "Initial session. Excellent condition."
            }
        ],
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=6)
    )

    c3 = Client(
        id="c-3",
        tenant_id="t-1",
        name="Rajesh Kumar",
        phone="9812345678",
        status="Lead",
        age=45,
        gender="Male",
        weight=96.2,
        height=180.0,
        visceral_fat=15,
        subcutaneous_fat=22.1,
        bmi=29.7,
        body_fat=31.2,
        muscle_mass=35.0,
        bmr=1880,
        biological_age=53,
        notes="High BMI and high biological age. Elevated visceral fat warning.",
        flagged=True,
        health_issues=["Overweight", "Diabetes"],
        health_issues_others="",
        history=[
            {
                "date": date_initial_3,
                "weight": 96.2,
                "height": 180.0,
                "bmi": 29.7,
                "visceralFat": 15,
                "subcutaneousFat": 22.1,
                "bodyFat": 31.2,
                "muscleMass": 35.0,
                "bmr": 1880,
                "biologicalAge": 53,
                "notes": "Initial assessment. High metabolic strain."
            }
        ],
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
    )

    db.add_all([c1, c2, c3])
    db.commit()
    db.close()
    print("Database seeding completed.")
