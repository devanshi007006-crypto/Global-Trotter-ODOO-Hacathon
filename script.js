async function generateTrip() {
    const destinationInput = document.getElementById("destination");
    const daysInput = document.getElementById("days");
    const budgetInput = document.getElementById("budget");
    const travelersInput = document.getElementById("travelers");
    const interestInput = document.getElementById("interest");

    const destination = (destinationInput && destinationInput.value.trim()) || "Goa";
    const days = (daysInput && daysInput.value) || "5";
    const budget = (budgetInput && budgetInput.value) || "80000";
    const travelers = (travelersInput && travelersInput.value) || "2";
    const interest = (interestInput && interestInput.value) || "Food";

    // 1. Update UI Summary Cards immediately
    const showDest = document.getElementById("showDestination");
    const showDaysEl = document.getElementById("showDays");
    const showTrav = document.getElementById("showTravelers");
    const showBudg = document.getElementById("showBudget");

    if (showDest) showDest.textContent = destination;
    if (showDaysEl) showDaysEl.textContent = days + " Days";
    if (showTrav) showTrav.textContent = travelers + " People";
    if (showBudg) showBudg.textContent = "₹" + Number(budget).toLocaleString("en-IN");

    // 2. Update Smart Budget Cards
    const totalB = Number(budget);
    const spentB = Math.round(totalB * 0.65);
    const remainingB = totalB - spentB;

    const totalBudgetEl = document.getElementById("totalBudget");
    const spentBudgetEl = document.getElementById("spentBudget");
    const remainingBudgetEl = document.getElementById("remainingBudget");

    if (totalBudgetEl) totalBudgetEl.textContent = "₹" + totalB.toLocaleString("en-IN");
    if (spentBudgetEl) spentBudgetEl.textContent = "₹" + spentB.toLocaleString("en-IN");
    if (remainingBudgetEl) remainingBudgetEl.textContent = "₹" + remainingB.toLocaleString("en-IN");

    // 3. Connect to Odoo ERP Backend API (/api/v1/trips)
    if (typeof createOdooTrip === "function") {
        const odooResponse = await createOdooTrip({
            destination,
            days,
            budget,
            travelers,
            interest
        });

        if (odooResponse && odooResponse.trip_id) {
            const tripDetails = await fetchOdooTripDetails(odooResponse.trip_id);
            if (tripDetails && tripDetails.itinerary) {
                console.log("🌟 Received Odoo Backend Itinerary Days:", tripDetails.itinerary);
            }
        }
    }

    // 4. Smooth Scroll to Dashboard
    const dashboard = document.getElementById("dashboard");
    if (dashboard) {
        dashboard.scrollIntoView({ behavior: "smooth" });
    }
    
}

