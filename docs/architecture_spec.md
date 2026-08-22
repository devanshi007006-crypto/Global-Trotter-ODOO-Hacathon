# 🌍 GlobalTrotter - System Architecture & Team Blueprint

## 🏛️ Executive System Architecture

GlobalTrotter unifies trip planning, itinerary management, budget tracking, AI optimization, and group collaboration on top of **Odoo ERP**.

```mermaid
graph TD
    User[📱 User / Web Client (Member 2)] -->|REST HTTP / JSON-RPC| API[🔌 Odoo API Gateway /api/v1]
    AI[🤖 AI Engine (Member 3)] -->|REST JSON Sync| API
    
    subgraph Odoo Backend Core (Member 1 - You)
        API --> Trip[gt.trip Header]
        Trip --> Day[gt.itinerary.day]
        Day --> Act[gt.activity]
        Trip --> Exp[gt.expense]
        Exp --> Split[gt.expense.split]
        Act --> Vote[gt.activity.vote]
        
        Trip --> OptEngine["🚀 'What-If?' Budget Optimizer"]
        Exp --> DebtEngine["💸 Debt Equalizer ('Who Owes Whom')"]
    end
```

---

## 🗄️ Database Models (Odoo Backend)

| Model Technical Name | Purpose | Key Attributes |
|---|---|---|
| `gt.trip` | Master Trip Header | `name`, `destination`, `start_date`, `end_date`, `duration_days`, `budget_total`, `budget_spent`, `budget_remaining`, `budget_status`, `status`, `traveler_ids` |
| `gt.itinerary.day` | Daily Container | `trip_id`, `day_number`, `date`, `title`, `day_cost` |
| `gt.activity` | Activity Item | `itinerary_day_id`, `name`, `category`, `start_time`, `duration_hours`, `cost`, `rating`, `is_indoor`, `vote_score` |
| `gt.expense` | Group Expense Line | `trip_id`, `name`, `paid_by_id`, `category`, `amount`, `date`, `split_type` |
| `gt.expense.split` | Debt Share Details | `expense_id`, `partner_id`, `share_amount`, `is_settled` |
| `gt.activity.vote` | Voting Engine | `activity_id`, `partner_id`, `vote_value (+1/-1)` |

---

## 🔌 API Endpoint Specifications

### 1. Retrieve Full Trip Details
* **Method**: `GET /api/v1/trips/<trip_id>`
* **Response**:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Alex & Friends Japan Adventure 2026",
    "destination": "Tokyo & Kyoto, Japan",
    "budget": {
      "total": 100000.0,
      "spent": 82000.0,
      "remaining": 18000.0,
      "status": "on_track"
    },
    "itinerary": [
      {
        "day_number": 1,
        "title": "Day 1 - Tokyo Arrival & Shibuya Crossing",
        "day_cost": 3700.0,
        "activities": [
          { "name": "Shibuya Sky Walk", "cost": 2200.0, "is_indoor": false }
        ]
      }
    ],
    "debt_summary": "💸 Rahul pays Devanshi ➡️ ₹2,500.00"
  }
}
```

### 2. Trigger "What-If?" Trip Optimizer
* **Method**: `POST /api/v1/trips/<trip_id>/optimize`
* **Payload**:
```json
{
  "opt_type": "cheaper_alternatives"
}
```
* **Options for `opt_type`**:
  - `"add_day"`: Extends trip by 1 day & adds itinerary day.
  - `"upgrade_flight"`: Recalculates budget with premium flight option.
  - `"cheaper_alternatives"`: Swaps expensive activities for budget alternatives (15% savings).
  - `"rain_mode"`: Swaps outdoor activities with indoor experiences.

---

## 👥 Team Work Breakdown

### 👩‍💻 Devanshi (Team Leader & Backend Architect)
* Core Odoo module development (`global_trotter`).
* Relational ORM models, business logic engines (`gt.trip`, `action_optimize_trip`, `_compute_debt_settlements`).
* Odoo Views (Kanban, Form, Tree, Pivot, Graph) and Security ACLs.
* API Gateway HTTP controllers (`/api/v1/trips`).

### 👩‍💻 Mishva (Frontend UI/UX Lead)
* Modern web dashboard / client UI (React, Vite, or Tailwind web view).
* Connects to Devanshi's REST endpoints (`/api/v1/trips`).
* Displays Day-by-Day itinerary tabs, interactive budget charts, and activity vote buttons.

### 🤖 Prachi Kanwar (AI + Recommendations Lead)
* Python script (`ai/recommendation_engine.py`) integrating Gemini/OpenAI API or recommendation rules.
* Formats output into JSON day-wise structure.
* Sends JSON payload to `/api/v1/trips/<id>/ai_sync`.

### 👩‍💻 Prachi Das (Integration, Testing & Pitch Lead)
* GitHub repository management, pull request reviews.
* End-to-end API testing.
* Pre-loading demo data (`data/demo_data.xml`).
* Preparing final Hackathon pitch deck and live demo script.


