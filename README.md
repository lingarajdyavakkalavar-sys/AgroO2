# PlanT CO₂ Farm — Sustainable Farming Assistant

PlanT CO₂ Farm is a production-ready application for sustainable agriculture, soil organic carbon (SOC) management, AI pest diagnostics, and industrial carbon procurement.

## Architecture

- **Backend**: FastAPI (Python 3.11.9), Uvicorn, Pydantic v2
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Deployment**: Render (Backend Web Service), Vercel/Static host (Frontend)

## Quick Start

### Backend
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

For detailed deployment instructions and Render configuration, see [DEPLOYMENT.md](./DEPLOYMENT.md).
