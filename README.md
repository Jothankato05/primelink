# PrimeLink

**Community Risk Intelligence Network** — real-time cross-sector monitoring for Nigerian communities, built by Primers Corporation.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-jothankato05.github.io%2Fprimelink-00C896?style=flat-square)](https://jothankato05.github.io/primelink/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Built by](https://img.shields.io/badge/Built%20by-Primers%20Corporation-1A2E4A?style=flat-square)](https://github.com/Jothankato05)

---

## The Problem

Nigeria's 36 million smallholder farmers, 200 million citizens, and community health systems operate in data silos. When a drought reduces soil moisture in Kano, no single system connects that environmental signal to the crop failure it predicts, the loan defaults it will trigger, the malnutrition it will cause, or the government agencies that need to respond.

By the time a crisis is visible to decision-makers, it is already cascading across sectors simultaneously.

## The Solution

PrimeLink is a real-time intelligence platform that monitors five risk sectors — **Environment, Agriculture, Health, Finance, and IoT** — for each community simultaneously. It applies cross-sector correlation models to detect multi-dimensional crises early, then triggers automated responses: insurance payouts, agency notifications, and resource deployment — without waiting for human triage.

**One sensor reading becomes a five-sector response in under 30 seconds.**

---

## Core Features

| Feature | Description |
|---|---|
| Community Risk Index | Composite 0–100 score aggregated from five sector readings, updated every three seconds |
| Cross-sector correlation | When environment degrades, the risk engine propagates projected impact forward to agriculture and health automatically |
| Parametric insurance engine | Finance score below threshold triggers immediate insurance disbursement with no claims process |
| Live alert feed | Sector-specific alerts classified as informational, elevated, or critical, distributed to subscribed agencies |
| IoT sensor network | 127 simulated field sensors across 8 Nigerian communities; live Socket.io data stream |
| Crisis simulation | Three scenario replays — Drought, Flood, Disease Outbreak — each demonstrating full automated response |
| Community risk map | Geographic overview of all monitored communities, colour-coded by composite risk level |
| Export report | Generates a signed HTML risk report downloadable per community |
| Onboarding tour | Six-step guided walkthrough of platform capabilities |
| Mobile application | Companion React Native app for field officers and community monitors |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PrimeLink Platform                        │
├──────────────────────┬──────────────────────────────────────────┤
│   Frontend (React)   │           Backend (Node.js)              │
│                      │                                           │
│  LoginScreen         │  Express 5 REST API                      │
│  OnboardingTour      │    GET /api/communities                   │
│  Dashboard           │    GET /api/communities/:id              │
│    RiskGauge x5      │    GET /api/alerts                       │
│    AlertFeed         │    GET /api/alerts/status                │
│    FinancePanel      │                                           │
│    NigeriaMap        │  Socket.io (real-time)                   │
│    ScenarioControl   │    sensor:update  (3s interval)          │
│  useSocket hook      │    alert:new      (threshold breach)     │
│                      │    map:overview   (30s interval)         │
│                      │                                           │
│                      │  IoT Sensor Simulator                    │
│                      │    127 sensors / 8 communities           │
│                      │    Random walk + mean reversion          │
│                      │    Cross-sector correlation engine       │
│                      │    Alert generation on threshold breach  │
└──────────────────────┴──────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│              Mobile App (Expo / React Native)     │
│  SplashScreen → DashboardScreen → AlertsScreen   │
│  SectorDetailScreen → CommunityMapScreen         │
└──────────────────────────────────────────────────┘
```

---

## Tech Stack

**Frontend**
- React 18, Vite 5
- Tailwind CSS 3
- Recharts (timeline visualisation)
- Lucide React (icon system)
- Socket.io Client (live data stream)

**Backend**
- Node.js, Express 5
- Socket.io 4
- Helmet, CORS, rate limiting
- In-memory IoT sensor simulator with cross-sector correlation

**Mobile**
- React Native, Expo SDK 51
- React Navigation (bottom tabs + stack)
- Socket.io Client

**Infrastructure**
- GitHub Pages (frontend hosting)
- Render / Railway compatible (backend deployment)

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Frontend (web dashboard)

```bash
cd frontend
npm install
npm run dev
```

Dashboard available at `http://localhost:5174`

### Backend (API + sensor simulator)

```bash
cd backend
npm install
node server.js
```

API available at `http://localhost:4000`

The frontend automatically connects to the backend via Socket.io. If the backend is offline, the frontend falls back to local simulation mode and displays a **SIMULATED** indicator.

### Mobile application

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go on Android or iOS.

---

## API Reference

### REST

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Service health and uptime |
| GET | `/api/communities` | All communities with current sector scores |
| GET | `/api/communities/:id` | Single community with 48-point score history |
| GET | `/api/alerts` | Recent alerts (default limit 20, max 100) |
| GET | `/api/alerts/status` | System-wide health snapshot |

### Socket.io Events (server → client)

| Event | Payload | Frequency |
|---|---|---|
| `sensor:update` | `{ communityId, scores, composite, onlineSensors, ts }` | Every 3 seconds per community |
| `alert:new` | `{ type, sector, community, text, time }` | On threshold breach |
| `map:overview` | Array of community composites | Every 30 seconds |

### Socket.io Events (client → server)

| Event | Payload | Description |
|---|---|---|
| `subscribe:community` | `communityId` | Subscribe to updates for a specific community |

---

## Deployment

### Frontend — GitHub Pages

```bash
cd frontend
npm run deploy
```

Deploys to `https://jothankato05.github.io/primelink/`

### Backend — Render

1. Create a new Web Service on [render.com](https://render.com)
2. Connect `Jothankato05/primelink` repository
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variable: `FRONTEND_URL=https://jothankato05.github.io`

---

## Business Model

PrimeLink generates revenue through three channels:

| Channel | Description | Target |
|---|---|---|
| Risk data API | Monthly subscription for banks and insurers consuming community risk scores | CBN-licensed microfinance institutions, insurtech companies |
| Parametric insurance integration | Revenue share on premiums for insurance products triggered by platform data | AIICO, NEM Insurance, startups like Pula |
| Government contracts | Annual data and early warning contracts with federal and state agencies | NEMA, FMoH, FMARD, state emergency management agencies |

---

## Market

- Nigeria's agricultural finance gap: **$10B+** (NIRSAL estimate)
- Parametric insurance market (global): **$3.6B → $10B by 2033** (12.25% CAGR)
- Nigeria fintech market: **$30.3B** by 2025
- Africa's uninsured smallholder farmers: **36 million** in Nigeria alone

PrimeLink sits at the intersection of these markets. No existing platform connects IoT sensor data to automated financial product triggers at community scale in Nigeria.

---

## Competitive Position

| Platform | Coverage | Data Source | Automated Finance | Nigeria-Native |
|---|---|---|---|---|
| Pula | Agriculture only | Satellite | Crop insurance only | No |
| Helium Health | Health only | Clinical records | None | Partial |
| ARC Ltd | Sovereign risk | Aggregate data | Government-level | No |
| **PrimeLink** | **5 sectors** | **IoT + crowd + satellite** | **Parametric, instant** | **Yes** |

---

## Team

**Primers Corporation** — Nigeria

- **Jerry** — Founder, product and engineering
- Building SecureLink (emergency SOS platform) and PrimeLink (community intelligence)
- Focused on sovereign technology for Nigeria and the African continent

---

## License

MIT License — see [LICENSE](LICENSE)

---

*PrimeLink is a product of Primers Corporation, Nigeria.*
