# CO₂ FARM — RENDER DEPLOYMENT & ARCHITECTURE GUIDE

This document describes the production deployment configuration, architecture, environment requirements, and step-by-step instructions for running **PlanT CO₂ Farm** on **Render**.

---

## 1. PROJECT ARCHITECTURE

- **Backend**: FastAPI (Python 3.11.9)
  - Entry Point: `app.main:app`
  - Web Server: Uvicorn (`uvicorn app.main:app --host 0.0.0.0 --port $PORT`)
  - Features: REST API v1 (`/api/v1`), CORS Middleware, Graceful Firebase & Secret Manager initialization fallbacks, Health Checks (`/health`).
- **Frontend**: React (Vite, Tailwind CSS, Lucide Icons)
  - Location: `frontend/`
  - Build Command: `npm run build`
  - Output Directory: `frontend/dist`
- **Database / Cloud**: Google Cloud Firestore & Firebase Admin SDK (Optional / Configurable)

---

## 2. PREREQUISITES & RUNTIME

- **Python Version**: `3.11.9` (Specified in `.python-version`, `runtime.txt`, and `render.yaml`)
- **Node.js**: `>=18.x` for building the frontend.

---

## 3. ENVIRONMENT VARIABLES INVENTORY

### Backend (Render Web Service)
| Variable Name | Required | Default / Format | Description |
| --- | --- | --- | --- |
| `PYTHON_VERSION` | **Yes** | `3.11.9` | Prevents Render from defaulting to unbuilt Python versions |
| `APP_ENV` | **Yes** | `production` | Application execution environment |
| `DEBUG` | **Yes** | `False` | Disables interactive OpenAPI docs in production |
| `PORT` | **Yes** | Injected by Render | Dynamically assigned port |
| `FRONTEND_URL` | **Yes** | `https://your-frontend-app.vercel.app` | Allowed origin for CORS |
| `JWT_SECRET_KEY` | **Yes** | Generated automatically | Generated securely by Render Blueprint (`generateValue: true`) |
| `FIREBASE_PROJECT_ID` | Optional | `plant-co2-farm` | Google Cloud / Firebase project identifier |
| `GCP_PROJECT_ID` | Optional | `plant-co2-farm` | GCP project for Secret Manager |
| `GEMINI_MODEL` | Optional | `gemini-1.5-flash` | Gemini model for AI diagnoses and agronomy advisor |

---

## 4. LOCAL DEVELOPMENT & TESTING

### Backend Setup
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Verify backend health:
`curl http://localhost:8000/health`

### Frontend Setup
```bash
cd frontend
npm install
npm run build
npm run dev
```

---

## 5. RENDER DEPLOYMENT INSTRUCTIONS

### Method 1: Render Blueprint (Recommended)
1. Push this repository to GitHub/GitLab.
2. In the [Render Dashboard](https://dashboard.render.com/), click **New +** -> **Blueprint**.
3. Connect your repository. Render will automatically detect `render.yaml`.
4. Click **Apply**. Render will create the `plant-co2-backend` web service.

### Method 2: Manual Web Service Setup
If deploying manually without Blueprint:
- **Service Type**: Web Service
- **Environment / Runtime**: Python 3
- **Region**: Oregon (or your preferred region)
- **Branch**: `main`
- **Build Command**: `pip install --no-cache-dir -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/health`
- **Environment Variables**:
  - `PYTHON_VERSION`: `3.11.9`
  - `APP_ENV`: `production`
  - `DEBUG`: `False`
  - `FRONTEND_URL`: your frontend app URL
  - `JWT_SECRET_KEY`: random 32-character secret

---

## 6. POST-DEPLOYMENT VERIFICATION CHECKLIST

- [x] Backend responds to health check: `GET https://<your-render-app>.onrender.com/health` returns `{"status":"healthy"}`
- [x] Backend API router responds: `GET https://<your-render-app>.onrender.com/api/v1/farms/me`
- [x] CORS properly configured to allow requests from `FRONTEND_URL`
- [x] Frontend successfully loads and connects to the production backend endpoints.
