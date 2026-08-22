function generateTrip() {
    const destinationInput = document.getElementById("destination");
    const daysInput = document.getElementById("days");
    const budgetInput = document.getElementById("budget");
    const travelersInput = document.getElementById("travelers");

    const destination = (destinationInput && destinationInput.value.trim()) || "Goa";
    const days = (daysInput && daysInput.value) || "5";
    const budget = (budgetInput && budgetInput.value) || "80000";
    const travelers = (travelersInput && travelersInput.value) || "2";

    const showDest = document.getElementById("showDestination");
    const showDaysEl = document.getElementById("showDays");
    const showTrav = document.getElementById("showTravelers");
    const showBudg = document.getElementById("showBudget");

    if (showDest) showDest.textContent = destination;
    if (showDaysEl) showDaysEl.textContent = days + " Days";
    if (showTrav) showTrav.textContent = travelers + " People";
    if (showBudg) showBudg.textContent = "₹" + Number(budget).toLocaleString("en-IN");

    const totalB = Number(budget);
    const spentB = Math.round(totalB * 0.65);
    const remainingB = totalB - spentB;

    const totalBudgetEl = document.getElementById("totalBudget");
    const spentBudgetEl = document.getElementById("spentBudget");
    const remainingBudgetEl = document.getElementById("remainingBudget");

    if (totalBudgetEl) totalBudgetEl.textContent = "₹" + totalB.toLocaleString("en-IN");
    if (spentBudgetEl) spentBudgetEl.textContent = "₹" + spentB.toLocaleString("en-IN");
    if (remainingBudgetEl) remainingBudgetEl.textContent = "₹" + remainingB.toLocaleString("en-IN");

    const dashboard = document.getElementById("dashboard");
    if (dashboard) {
        dashboard.scrollIntoView({ behavior: "smooth" });
    }
    
}

