# 🌍 GlobalTrotter India – Smart Travel & Trip Management Workspace (Odoo ERP)

[![Odoo ERP](https://img.shields.io/badge/Odoo-17.0-purple.svg)](https://www.odoo.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![License: LGPL v3](https://img.shields.io/badge/License-LGPL_v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0.html)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-success.svg)](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/)

> **Odoo Global Hackathon Project**  
> **Tagline:** Transforming fragmented travel planning into a unified, AI-powered ERP workspace—from day-wise Indian circuit itineraries and budget analytics to group collaboration and intelligent "What-If" decision support.

🌐 **Live Website Demo**: [https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/)

---

## 🌟 Key Features

1. **🇮🇳 Indian Travel Circuit Presets**: Interactive destination templates for **Jaipur (Rajasthan)**, **Alleppey (Kerala)**, **Goa Beach Circuit**, and **Leh-Ladakh** with experience category filtering.
2. **🗺️ Smart Trip Workspace**: Manage destinations, dates, duration, travel styles, and traveler lists in custom Odoo models (`gt.trip`).
3. **🗓️ Day-wise Itinerary Manager**: Detailed daily activities with timing, category tags (Heritage, Culinary, Adventure, Wellness, Sightseeing), ratings, and weather flags (`gt.itinerary.day`, `gt.activity`).
4. **💰 Smart Budget & Expense Analytics**: Visual progress bar tracking allocated vs spent budget, real-time balance alerts, and dynamic graph dashboards (`gt.expense`).
5. **👥 Group Debt Equalizer ("Who Owes Whom")**: Minimum-cash-flow algorithm calculating fair debt settlement between group members (`_compute_debt_settlements`).
6. **⚡ "What-If?" Trip Optimizer**: Backend engine simulating flight upgrades, budget reduction, duration extension, and rain weather activity swaps (`action_optimize_trip`).
7. **🤖 AI & REST API Gateway**: REST/JSON endpoints (`/api/v1/trips`) connecting external AI engines and frontend web clients directly to Odoo ORM.

---

## 📂 Repository Layout

```text
global-trotter/
├── README.md                          # Project documentation & execution guide
├── requirements.txt                   # Core Python & API dependencies
├── index.html                         # Interactive Destination Hub & Trip Workspace (GitHub Pages)
├── style.css                          # Dark mode glassmorphism UI & Indian Royal theme
├── script.js                          # Dynamic trip planner, destination presets & budget engine
├── AI.js                              # AI Subsystem integration helper
│
├── odoo/                              # Custom Odoo Module
│   ├── script_api.js                  # Frontend Odoo REST API bridge
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
│       │   └── ir.model.access.csv    # Access Rights & ACLs
│       ├── views/                     # Odoo Web Views (Kanban, Form, Pivot, Graph)
│       │   ├── menu_views.xml
│       │   ├── trip_views.xml
│       │   ├── itinerary_views.xml
│       │   └── expense_views.xml
│       └── data/
│           └── demo_data.xml          # Pre-loaded hackathon demo dataset (Japan & Paris trips)
│
├── ai/                                # AI Recommendation Subsystem
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
addons_path = /path/to/odoo/addons,/path/to/global-trotter/odoo
```
Start Odoo server and update the module list, then install **GlobalTrotter** (`global_trotter`).

### 3. Test API Gateway Endpoints
* Fetch all trips: `GET http://localhost:8069/api/v1/trips`
* Get trip details: `GET http://localhost:8069/api/v1/trips/1`
* Trigger "What-If" Optimizer: `POST http://localhost:8069/api/v1/trips/1/optimize` with `{"opt_type": "rain_mode"}`

### 4. Run AI Generator (Prachi Kanwar's Script)
```bash
python ai/recommendation_engine.py
```

---

## 👨‍👩‍👧‍👦 Team Roles & Ownership

| Member | Role | Core Responsibility |
|---|---|---|
| **Devanshi** | **Team Leader & Backend Architect** | Custom Odoo module development, ORM models, business logic engines, security ACLs, REST API endpoints |
| **Mishva** | **Frontend UI/UX Lead** | Web/Mobile interface, destination portal UI, dashboard integration, itinerary UI |
| **Prachi Kanwar** | **AI & Recommendation Lead** | AI itinerary generation script (`ai/recommendation_engine.py`), preference matching |
| **Prachi Das** | **Integration, Testing & Pitch Lead** | End-to-end API testing, documentation, Git management, presentation deck |

---

## 🏆 License
Released under the LGPL-3 License for Odoo Hackathon.
