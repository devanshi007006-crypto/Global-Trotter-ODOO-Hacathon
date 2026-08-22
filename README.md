# 🌍 GlobalTrotter – Smart Travel & Trip Management Platform (Odoo ERP)

> **Odoo Global Hackathon Project**  
> **Tagline:** Transforming fragmented travel planning into a unified, AI-powered ERP workspace—from itinerary generation and budget management to group collaboration and intelligent "What-If" decision support.

---

## 🌟 Key Features

1. **🗺️ Smart Trip Workspace**: Manage destinations, dates, duration, travel styles, and traveler lists in custom Odoo models (`gt.trip`).
2. **🗓️ Day-wise Itinerary Builder**: Detailed activities with timing, categories (Food, Sightseeing, Adventure, Transit), ratings, costs, and indoor/outdoor weather flags (`gt.itinerary.day`, `gt.activity`).
3. **💰 Smart Budget & Expense Tracker**: Dynamic category analytics (Flights, Hotels, Food, Activities) with real-time remaining budget alerts and visual Graph/Pivot dashboards (`gt.expense`).
4. **👥 Group Debt Equalizer ("Who Owes Whom")**: Minimum-cash-flow algorithm calculating fair debt settlement between group members (`_compute_debt_settlements`).
5. **⚡ "What-If?" Trip Optimizer**: Backend engine simulating flight upgrades, budget reduction, duration extension, and rain weather activity swaps (`action_optimize_trip`).
6. **🤖 AI Recommendation Gateway**: REST/JSON endpoints (`/api/v1/trips`) connecting external AI engines and frontend interfaces directly to Odoo ORM.

---

## 📂 Repository Layout

```text
global-trotter/
├── README.md                          # Project documentation & execution guide
├── requirements.txt                   # Core Python & API dependencies
│
├── odoo/                              # Custom Odoo Module
│   └── global_trotter/
│       ├── __manifest__.py            # Odoo module manifest
│       ├── __init__.py
│       ├── models/                    # Odoo ORM Data Models & Business Logic
│       │   ├── gt_trip.py             # Main Trip model & "What-If" Optimizer
│       │   ├── gt_itinerary.py        # Day-wise Itinerary & Activity models
│       │   ├── gt_expense.py          # Expense tracking & Debt Balancer engine
│       │   └── gt_activity_vote.py    # Traveler voting model
│       ├── controllers/               # REST / JSON-RPC Gateway
│       │   └── api_controller.py      # /api/v1 HTTP Endpoints
│       ├── security/
39: │       │   └── ir.model.access.csv    # Access Rights & ACLs
│       ├── views/                     # Odoo Web Views (Kanban, Form, Pivot, Graph)
│       │   ├── menu_views.xml
│       │   ├── trip_views.xml
│       │   ├── itinerary_views.xml
│       │   └── expense_views.xml
│       └── data/
│           └── demo_data.xml          # Pre-loaded hackathon demo dataset (Japan & Paris trips)
│
├── ai/                                # AI Recommendation Subsystem (Member 3)
│   └── recommendation_engine.py       # AI Itinerary generator & Odoo sync script
│
└── docs/                              # System Specs & Team Blueprint
    └── architecture_spec.md           # Architecture diagram, ERD & API specifications
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Odoo with GlobalTrotter Module
Add the `global-trotter/odoo` folder to your Odoo `addons_path` in your `odoo.conf` file:
```ini
addons_path = /path/to/odoo/addons,C:\Users\Devanshi\.gemini\antigravity\scratch\global-trotter\odoo
```
Start Odoo server and update the module list, then install **GlobalTrotter** (`global_trotter`).

### 3. Test API Gateway Endpoints
* Fetch all trips: `GET http://localhost:8069/api/v1/trips`
* Get trip details: `GET http://localhost:8069/api/v1/trips/1`
* Trigger "What-If" Optimizer: `POST http://localhost:8069/api/v1/trips/1/optimize` with `{"opt_type": "rain_mode"}`

### 4. Run AI Generator (Member 3 Script)
```bash
python ai/recommendation_engine.py
```

---

## 👨‍👩‍👧‍👦 Team Roles & Ownership

| Member | Role | Core Responsibility |
|---|---|---|
| **Devanshi** | **Team Leader & Backend Architect** | Custom Odoo module development, ORM models, business logic engines, security ACLs, REST API endpoints |
| **Mishva** | **Frontend UI/UX Lead** | Web/Mobile interface, dashboard integration, travel cards, itinerary UI |
| **Prachi Kanwar** | **AI & Recommendation Lead** | AI itinerary generation script (`ai/recommendation_engine.py`), preference matching |
| **Prachi Das** | **Integration, Testing & Pitch Lead** | End-to-end API testing, documentation, Git management, presentation deck |

---

## 🏆 License
Released under the LGPL-3 License for Odoo Hackathon.
