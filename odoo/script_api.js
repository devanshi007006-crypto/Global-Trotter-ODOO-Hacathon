/**
 * GlobalTrotter Odoo ERP Backend API Bridge
 * Connects Frontend User Interface to Odoo REST Controller (/api/v1/trips)
 */

const ODOO_API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? "http://localhost:8069/api/v1" 
    : "/api/v1";

let currentTripId = null;

/**
 * Generic API Fetch Helper with CORS & Error Handling
 */
async function odooApiFetch(endpoint, method = "GET", payload = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (payload) {
        options.body = JSON.stringify(payload);
    }

    const response = await fetch(ODOO_API_BASE + endpoint, options);
    if (!response.ok) {
        throw new Error(`Odoo API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

/**
 * POST /api/v1/trips - Create new trip in Odoo ORM (gt.trip)
 */
async function createOdooTrip(tripData) {
    try {
        const payload = {
            name: `${tripData.destination} Trip`,
            destination: tripData.destination,
            budget_total: parseFloat(tripData.budget) || 50000.0,
            num_travelers: parseInt(tripData.travelers) || 1,
            travel_style: tripData.interest ? tripData.interest.toLowerCase() : "balanced",
            interests: tripData.interest || "General Exploration"
        };

        const res = await odooApiFetch("/trips", "POST", payload);
        if (res.status === "success") {
            currentTripId = res.trip_id;
            console.log("✅ Trip created successfully in Odoo ORM! Trip ID:", currentTripId);
            return res;
        }
    } catch (err) {
        console.warn("⚠️ Odoo Backend Offline or Unreachable. Falling back to local mode:", err.message);
        return null;
    }
}

/**
 * GET /api/v1/trips/<trip_id> - Fetch full trip details, day activities & expenses
 */
async function fetchOdooTripDetails(tripId) {
    try {
        const res = await odooApiFetch(`/trips/${tripId}`, "GET");
        if (res.status === "success") {
            return res.data;
        }
    } catch (err) {
        console.warn("⚠️ Unable to fetch Odoo trip details:", err.message);
        return null;
    }
}

/**
 * POST /api/v1/trips/<trip_id>/optimize - Trigger Odoo "What-If" Optimizer
 */
async function optimizeOdooTrip(tripId, optType = "rain_mode") {
    try {
        const res = await odooApiFetch(`/trips/${tripId}/optimize`, "POST", { opt_type: optType });
        if (res.status === "success") {
            console.log("🚀 Odoo What-If Trip Optimizer executed:", res);
            return res;
        }
    } catch (err) {
        console.warn("⚠️ Unable to trigger Odoo optimizer:", err.message);
        return null;
    }
}
