# Production Deployment Guide: Sakria Wellness Platform

This guide outlines the step-by-step procedures for deploying the Sakria Wellness Operator Platform to a production environment. 

---

## 1. Architecture Overview
Sakria is designed as a lightweight, performant, and secure multi-tenant platform:
* **Frontend**: Vanilla HTML5, JS, and CSS SPA (Single Page Application).
* **Backend**: FastAPI (Python) web application.
* **Database**: SQLAlchemy ORM. Supports **SQLite** (local development) and **PostgreSQL / CockroachDB** (production).
* **Monolithic Serving**: FastAPI is configured to serve the frontend SPA static files (`index.html`, `/src`, `/public`) automatically. This means you only need **one single hosting service** to serve both the backend and frontend, eliminating CORS issues and minimizing costs.

---

## 2. Step 1: Database Setup (PostgreSQL / CockroachDB)
Do not use SQLite in production (Render/Railway filesystems are ephemeral; your data will be wiped out when the server restarts). Instead, set up a production database:

### Option A: CockroachDB Serverless (Recommended)
* **Storage Limit**: 10 GB (permanently free).
* **Setup**:
  1. Sign up on [Cockroach Labs](https://cockroachlabs.cloud/).
  2. Create a Serverless cluster (select "Free plan").
  3. Generate the SQL Connection String (e.g., `postgresql://username:password@host:port/database?sslmode=verify-full`).
  4. **Cost**: $0/month. Set a spending limit of $0 to ensure it remains 100% free even if requests scale.

### Option B: Neon.tech PostgreSQL
* **Storage Limit**: 3 GB (permanently free).
* **Setup**:
  1. Sign up on [Neon.tech](https://neon.tech/).
  2. Create a new project and select the PostgreSQL version.
  3. Copy the Connection URI.
  4. **Cost**: $0/month.

---

## 3. Step 2: Choose Your Hosting Provider

### Option A: Deploying to Render (Recommended)
Render is the simplest option for hosting the monolithic application (FastAPI + Frontend).

1. **Create a Render Account**: Sign up on [Render](https://render.com/).
2. **Create a New Web Service**:
   * Connect your GitHub repository containing the Sakria project.
   * **Environment**: `Python`
   * **Build Command**: 
     ```bash
     pip install -r requirements.txt
     ```
   * **Start Command**: 
     ```bash
     uvicorn backend.main:app --host 0.0.0.0 --port $PORT
     ```
   * **Instance Type**:
     * **Free Tier**: Free, but the server will sleep after 15 minutes of inactivity (takes ~50 seconds to wake up).
     * **Starter Tier ($7/month)**: Keeps the server awake 24/7 (strongly recommended for professional client use).
3. **Configure Environment Variables** (see Section 4).

### Option B: Deploying to Railway
Railway provides fast deployments with zero-downtime restarts.

1. **Create a Railway Account**: Sign up on [Railway.app](https://railway.app/).
2. **New Project**: Connect your GitHub repository.
3. **Start Command**: Railway will automatically detect the Python environment. Set your custom start command:
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```
4. **Cost**: Uses a usage-based credit model. The starter tier is ~$5/month.

---

## 4. Step 3: Environment Variables
Add these environment variables in your hosting provider's settings (Render Dashboard -> Environment / Railway Variables):

| Key | Example Value | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:26257/sakria?sslmode=require` | Connection string to Neon/CockroachDB. |
| `CORS_ORIGINS` | `https://yourdomain.com,http://localhost:8080` | List of domains allowed to make API calls (comma-separated). |
| `ADMIN_PASSWORD` | `your_secure_admin_password_here` | Custom secure password for the admin console (defaults to `sakria_admin_2026` if not set). |

---

## 5. Step 4: Verification & Maintenance
1. **Automatic Tables Creation**: On startup, FastAPI calls `Base.metadata.create_all()` which automatically generates all tables (`tenants`, `clients`) on your production PostgreSQL/CockroachDB database.
2. **Default Admin Login**: You can immediately log into the admin panel at `https://your-domain.com/#admin-console` using:
   * **Username**: `admin`
   * **Password**: `sakria_admin_2026` (unless overridden by the `ADMIN_PASSWORD` environment variable)
3. **Reset/Seed Coach**: Create new coach accounts directly from the Admin console. They can log in instantly with their clean usernames.
4. **Logs Monitoring**: Check Render/Railway live application logs to track connections or debug errors.
