# PlanT CO₂ Farm - Sustainable Farming Platform

A full-stack sustainable farming platform with carbon tracking, AI-powered crop advisory, and carbon credit marketplace.

## Architecture

- **Frontend**: React 19 + Vite 8 + Tailwind CSS v4 + i18next (10 Indian languages) + PWA
- **Backend**: FastAPI + uvicorn + Firebase Admin + Google Gemini AI + Razorpay
- **Database**: Firestore (with mock fallback for local development)
- **Deployment**: Vercel (frontend) + Render (backend)

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn
- Firebase project with Firestore enabled
- Google Cloud project with Generative AI API enabled
- Razorpay account (for payments)

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/lingarajdyavakkalavar-sys/AgroO2.git
cd AgroO2
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Set up environment variables (copy example and edit)
cp .env.example .env
# Edit .env with your actual credentials
```

**Required `.env` variables for local development:**
```env
# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
GCP_PROJECT_ID=your-gcp-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-sa.json

# JWT
JWT_SECRET_KEY=your-32-character-random-secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRE_DAYS=30

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash

# Razorpay (Test Mode)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Optional
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=orders@yourdomain.com

# App
APP_ENV=development
DEBUG=True
```

**Note**: For local development without Firebase credentials, the backend automatically uses a mock Firestore implementation.

```bash
# Start backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env  # if exists, or create .env
```

**Frontend `.env`:**
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

```bash
# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### 4. Verify Everything Works

1. Open `http://localhost:5173` - Frontend should load
2. Open `http://localhost:8000/health` - Should return `{"status":"healthy",...}`
3. Open `http://localhost:8000/docs` - FastAPI interactive docs

---

## Project Structure

```
AgroO2/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API clients
│   │   ├── hooks/            # Custom React hooks
│   │   ├── i18n/             # Internationalization (10 Indian languages)
│   │   └── styles/           # Tailwind CSS + custom styles
│   ├── public/               # Static assets, PWA manifest
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── core/             # Config, security, Firebase init
│   │   ├── api/v1/           # API routes (auth, farms, carbon, weather, etc.)
│   │   ├── services/         # Business logic (Razorpay, Vertex AI, etc.)
│   │   └── models/           # Pydantic models
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── render.yaml           # Render deployment config
│   ├── .python-version       # Python 3.11.2
│   └── .env                  # Local environment (gitignored)
│
├── .python-version           # Python 3.11.2
├── runtime.txt               # python-3.11.2
├── render.yaml               # Render deployment config
├── .env.example              # Template for environment variables
├── .gitignore
└── README.md                 # This file
```

---

## Key Features

- **Carbon Tracking**: Calculate and track soil carbon sequestration
- **AI Crop Advisor**: Gemini-powered chat for farming advice
- **Pest/Disease Detection**: Image-based diagnosis
- **Carbon Credit Marketplace**: Buy/sell verified carbon credits
- **Weather & Soil Monitoring**: Real-time data integration
- **Multi-language Support**: 10 Indian languages via i18next
- **PWA Support**: Offline-capable progressive web app

---

## API Endpoints (v1)

| Module | Endpoints |
|--------|-----------|
| Auth | `/auth/google`, `/auth/refresh`, `/auth/me` |
| Farms | `/farms/me`, `/farms/onboarding` |
| Carbon | `/carbon/score`, `/carbon/trend`, `/carbon/calculate` |
| Weather | `/weather` |
| Diagnoses | `/diagnoses/analyze`, `/diagnoses` |
| Chat | `/chat`, `/chat/history` |
| Tasks | `/tasks` |
| Products | `/products/co2` |
| Orders | `/orders/co2` |

Full interactive docs at `/docs` when backend is running.

---

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test  # if configured
```

---

## Deployment

### Frontend → Vercel

1. Connect GitHub repo to Vercel
2. Set `VITE_API_BASE_URL=https://your-render-url.onrender.com/api/v1`
3. Deploy

### Backend → Render

1. Create Web Service from GitHub repo
2. Build: `pip install --no-cache-dir -r requirements.txt`
4. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard (see `.env.example`)

---

## Environment Variables Reference

### Backend (Required for Production)

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_ENV` | Environment | `production` |
| `DEBUG` | Debug mode | `False` |
| `FRONTEND_URL` | Vercel URL for CORS | `https://your-app.vercel.app` |
| `FIREBASE_PROJECT_ID` | Firebase project | `plant-co2-farm` |
| `GCP_PROJECT_ID` | GCP project | `plant-co2-farm` |
| `JWT_SECRET_KEY` | 32-char random string | `...` |
| `GEMINI_API_KEY` | Google AI Studio key | `AIza...` |
| `RAZORPAY_KEY_ID` | Razorpay dashboard | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay dashboard | `...` |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay dashboard | `...` |

### Frontend

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://api.yourdomain.com/api/v1` |

---

## Troubleshooting

### Backend won't start - `ModuleNotFoundError: pkg_resources`

```bash
pip install setuptools==69.5.1
```

### `maturin` / `cargo` build errors on Render

Ensure `pythonVersion: "3.11.2"` is set in `render.yaml`. Python 3.14 lacks wheels for `cryptography`.

### CORS errors

Verify `FRONTEND_URL` in backend `.env` matches your Vercel deployment URL exactly.

### Firebase connection issues

- Verify `FIREBASE_SERVICE_ACCOUNT_PATH` points to valid service account JSON
- Ensure Firestore API is enabled in Google Cloud Console
- For local dev without credentials: mock Firestore activates automatically

---

## License

Proprietary - PlanT CO₂ Farm Platform

---

## Support

For issues or questions, check the [GitHub Issues](https://github.com/lingarajdyavakkalavar-sys/AgroO2/issues).