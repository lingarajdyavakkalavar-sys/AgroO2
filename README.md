# PlanT CO₂ Farm — Sustainable Farming Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/release/python-3119/)
[![Node.js >=18](https://img.shields.io/badge/node-≥18-green.svg)](https://nodejs.org/)
[![Render Deploy](https://img.shields.io/badge/deploy‑Render-orange.svg)](https://render.com/)
[![Vercel Deploy](https://img.shields.io/badge/deploy‑Vercel-black.svg)](https://vercel.com/)

## Overview

**PlanT CO₂ Farm** is a full-stack web application designed to help farmers manage sustainable agriculture practices, track soil organic carbon (SOC), get AI-powered pest diagnostics, and handle carbon procurement. The application combines a production-ready FastAPI backend with a modern React frontend, deployed on Render and Vercel respectively.

The system enables farmers to:
- Monitor soil organic carbon levels and trends
- Get AI-generated pest diagnoses and treatment recommendations
- Manage farm operations and product listings
- Process payments via Razorpay
- Handle email notifications via SendGrid
- Authenticate users securely with JWT

## Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Pydantic v2
- **Server**: Uvicorn
- **API Versioning**: `/api/v1`
- **Authentication**: JWT with HS256 algorithm
- **Database**: Google Cloud Firestore / Firebase Admin SDK (optional)
- **AI/ML**: Google Gemini model for agronomy advisory and pest diagnostics
- **Services**: Razorpay payments, SendGrid email, Google Cloud Storage/Secret Manager
- **Features**: CORS middleware, health checks, graceful startup seeding, Firebase initialization

### Frontend (React)
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build**: Static site deployed to Vercel
- **Responsive**: Mobile-first design

### Deployment
- **Backend**: Render Web Service (Python 3.11.9)
- **Frontend**: Vercel Static Hosting
- **Database**: Google Cloud Firestore (configurable via environment variables)
- **CI/CD**: Automatic deploys from GitHub on push to `main`

## Features

### Farm Management
- Create and manage farm profiles
- Track soil organic carbon (SOC) measurements over time
- View farm analytics and history

### AI-Powered Diagnostics
- Upload plant images for pest/disease identification
- Get AI-generated treatment recommendations via Google Gemini
- Actionable advice for common agricultural pests

### Carbon Procurement
- Marketplace for carbon credits
- Procurement tracking and management
- Price estimation and deals

### User Authentication
- Secure sign-up/login with JWT
- Protected routes and API endpoints
- Role-based access control

### Payment Processing
- Razorpay integration for transactions
- Order management and webhooks
- Test mode support

### Notification System
- SendGrid email notifications
- Order confirmations and alerts
- Farm activity summaries

## Quick Start

### Prerequisites

- **Python**: >= 3.11.9
- **Node.js**: >= 18.x
- **Git**: For version control

### Local Development - Backend

```bash
# 1. Clone the repository
git clone https://github.com/lingarajdyavakkalavar-sys/AgroO2.git
cd AgroO2

# 2. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
cp .env.example .env
# Edit .env with your API keys (Gemini, Razorpay, SendGrid, Firebase)

# 5. Start the backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000

# 6. Verify backend health
curl http://localhost:8000/health
# Expected: {"status":"healthy","version":"1.0.0","environment":"development"}
```

### Local Development - Frontend

```bash
# 1. Install frontend dependencies
cd frontend
npm install

# 2. Start the development server
npm run dev

# 3. Open http://localhost:5173 in your browser
```

### Full Local Development

Run both backend and frontend concurrently:

```bash
# Terminal 1: Backend
cd AgroO2
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Terminal 2: Frontend  
cd AgroO2/frontend
npm run dev
```
