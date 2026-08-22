# ✈️ GlobalTrotter — Odoo ERP Travel Planning & Multi-City Itinerary Engine

[![Odoo ERP 17.0](https://img.shields.io/badge/Odoo%20ERP-17.0-purple.svg)](https://www.odoo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-emerald.svg)](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/)

> **GlobalTrotter** is a state-of-the-art travel planning and budget optimization platform powered by **Odoo ERP 17.0 ORM** backend controllers and a glassmorphic Web App interface. Designed for multi-city circuits across India and global destinations, GlobalTrotter enables travelers to build day-wise itineraries, track section budgets, split group expenses equally, and interact within a vibrant traveler community.

---

## 🚀 Live Demo & Links

- 🚪 **Authentication Gateway (Screen 1 & 2)**: [login.html](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/login.html)
- 🌐 **Home Dashboard**: [index.html](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/index.html)
- 🔍 **Search Places & Explore (Screen 7)**: [search.html](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/search.html)
- 📝 **Create Trip Wizard (Screen 3 & 4)**: [new_trip.html](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/new_trip.html) | [screen3.html](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/screen3.html)
- 🧳 **My Trips Directory (Screen 4)**: [trip_list.html](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/trip_list.html)
- 🗺️ **Build Itinerary Screen (Screen 5)**: [itinerary_builder.html](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/itinerary_builder.html)
- 📊 **Itinerary & Expense View (Screen 9)**: [itinerary_view.html](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/itinerary_view.html)
- 👥 **Community Tab Screen (Screen 10)**: [community.html](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/community.html)
- 📅 **Calendar Timeline (Screen 10)**: [calendar.html](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/calendar.html)
- 📈 **Admin Analytics Dashboard (Screen 13)**: [AdminPanel.html](https://devanshi007006-crypto.github.io/Global-Trotter-ODOO-Hacathon/AdminPanel.html)

---

## 👥 Team Roster

| Role | Name | Primary Domain | GitHub |
| :--- | :--- | :--- | :--- |
| **Team Leader & Backend Architect** | **Devanshi** | Odoo ORM Models, Auth REST Endpoints, DB Sync | [@devanshi007006-crypto](https://github.com/devanshi007006-crypto) |
| **Frontend UI/UX Lead** | **Mishva** | Glassmorphism Aesthetics, Responsive Layouts | Contributor |
| **AI & Recommendation Lead** | **Prachi Kanwar** | Circuit Optimization & Destination Logic | Contributor |
| **Integration & Pitch Lead** | **Prachi Das** | Testing, Presentation & Workflows | Contributor |

---

## ✨ Key Features & Specification Support

### 1. 🚪 Authentication Gateway (`login.html`)
- **Screen 1 (Login)** & **Screen 2 (Registration)** matching design specifications without explicit screen labels.
- **Strong Password Validation**: Enforces 8+ characters, uppercase, lowercase, numbers, and special characters with a live visual strength bar (Red ➔ Yellow ➔ Green).
- **Strict Account Check**: Blocks unauthenticated logins and auto-redirects unregistered visitors to the Registration tab.
- **Show/Hide Password Eye Toggle**: Instant eye icon toggle for all password input fields.
- **Workable Password Recovery Modal**: 6-digit OTP dispatch and new password reset flow.

### 2. 🗺️ Build Itinerary Engine (`itinerary_builder.html`)
- **Screen 5 (Build Itinerary Screen)**: Organizes trips into structured section cards (Travel, Hotel, Sightseeing, Dining).
- **Date Range & Budget Input**: Start date to end date picker + section budget field in ₹.
- **Dynamic Section Adder (`+ Add another Section`)**: Appends new section cards dynamically with live combined budget tallying.
- **REST API Persistence**: Syncs section cards directly to Odoo ORM models (`gt.itinerary.day`, `gt.activity`) and local storage.

### 3. 📊 Activity & Expense View (`itinerary_view.html`)
- **Screen 9 (Itinerary View with Budget Section)**: Dual-column view listing physical activities on the left and expenses on the right.
- **Flow Arrows**: Sequential downward arrows connecting daily activities.
- **Live Search & Filters**: Search bar to filter activities by name or category in real-time.

### 4. 👥 Community Tab (`community.html`)
- **Screen 10 (Community Tab Screen)**: Circle user avatars next to traveler post cards.
- **Interactive Upvotes & Discussions**: Upvote likes button, comment threads, and tag pills (*#JaipurForts*, *#KeralaBackwaters*).
- **Publish Post**: Real-time post publishing synced to Odoo backend API (`POST /api/v1/community/post`).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Modern Vanilla CSS3 with CSS Grid & Flexbox, FontAwesome 6 Icons, Google Fonts (*Outfit*, *Plus Jakarta Sans*).
- **Backend ERP**: Python 3.10+, Odoo 17.0 ERP Framework, `http.Controller` REST API Endpoints.
- **Database Models**:
  - `res.partner`: Traveler Profile & Credentials.
  - `gt.trip`: Trip Metadata, Budget Allocated, Budget Spent, Travelers.
  - `gt.itinerary.day`: Day/Section Number, Title, Day Cost.
  - `gt.activity`: Activity Name, Category, Start Time, Cost, Indoor Flag.
  - `gt.expense`: Expense Category, Payer ID, Shared Participants, Amount.
- **Client Persistence**: Dual-layer strategy using REST API calls with `localStorage` fallbacks (`gt_accounts`, `gt_trips`, `gt_saved_itinerary_sections`, `gt_community_posts`).

---

## ⚡ Odoo REST API Endpoints

```http
POST /api/v1/auth/register          - Create/register traveler account in res.partner
POST /api/v1/auth/login             - Authenticate user credentials against Odoo ORM
POST /api/v1/auth/forgot_password   - Send 6-digit OTP and reset password link
POST /api/v1/trips/generate         - Create new trip and auto-generate itinerary days
GET  /api/v1/trips                  - List all active and completed trips
POST /api/v1/trips/<id>/itinerary   - Save section cards and activities to gt.itinerary.day
POST /api/v1/community/post         - Publish community post to feed
```

---

## 💻 Local Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/devanshi007006-crypto/Global-Trotter-ODOO-Hacathon.git
   cd Global-Trotter-ODOO-Hacathon
   ```

2. **Run Frontend Workspace**:
   - Open `login.html` or `index.html` directly in any web browser, or serve using VS Code Live Server / Python HTTP server:
     ```bash
     python -m http.server 8000
     ```
   - Open `http://localhost:8000/login.html` in your browser.

3. **Install & Run Odoo ERP Backend (Optional for Server Sync)**:
   - Ensure Odoo 17.0 is installed on Python 3.10+.
   - Add `odoo/global_trotter` module to your Odoo `addons_path`.
   - Update app list and install `global_trotter` module in Odoo Admin settings.

---

## 📄 License
This project is released under the **MIT License**. Created by the **GlobalTrotter Team** for the Odoo Hackathon 2026.
