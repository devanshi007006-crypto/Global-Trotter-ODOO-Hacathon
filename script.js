/**
 * GlobalTrotter India - Travel & Trip Management Engine
 * Handles Destination Presets, Category Filtering, Itinerary Generation & Group Debt Settlement
 */

/**
 * Quick-select a destination card to populate trip form
 */
function quickSelectDest(destination, days, budget, interest) {
    document.getElementById("destination").value = destination;
    document.getElementById("days").value = days;
    document.getElementById("budget").value = budget;

    const interestSelect = document.getElementById("interest");
    if (interestSelect) {
        for (let i = 0; i < interestSelect.options.length; i++) {
            if (interestSelect.options[i].text.toLowerCase().includes(interest.toLowerCase().split(' ')[0])) {
                interestSelect.selectedIndex = i;
                break;
            }
        }
    }

    // Smooth scroll to planner card
    const planner = document.getElementById("planner");
    if (planner) {
        planner.scrollIntoView({ behavior: "smooth" });
    }
}

/**
 * Filter destination cards by experience category
 */
function filterCategory(category) {
    const chips = document.querySelectorAll(".chip");
    chips.forEach(chip => chip.classList.remove("active"));

    if (event && event.currentTarget) {
        event.currentTarget.classList.add("active");
    }

    const cards = document.querySelectorAll(".dest-card");
    cards.forEach(card => {
        if (category === "all" || card.getAttribute("data-category") === category) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

/**
 * Custom Day-wise Itinerary Generators for Indian Destinations
 */
function getIndianItinerary(destination, days) {
    const destLower = destination.toLowerCase();

    if (destLower.includes("kerala") || destLower.includes("alleppey")) {
        return [
            { day: 1, title: "Cochin Arrival & Heritage Fort Kochi", act: ["09:00 AM: St. Francis Church & Chinese Nets", "01:00 PM: Coastal Seafood Lunch", "04:30 PM: Kathakali Cultural Dance Show"] },
            { day: 2, title: "Alleppey Houseboat Backwater Cruise", act: ["10:00 AM: Private Houseboat Boarding", "01:30 PM: Traditional Karimeen Meals on Board", "05:00 PM: Village Canoe Tour & Sunset"] },
            { day: 3, title: "Munnar Tea Gardens & Spice Plantation", act: ["09:30 AM: Tea Plantation Walk & Tasting", "02:00 PM: Spice Garden Guided Tour", "06:00 PM: Ayurvedic Wellness Massage"] }
        ];
    } else if (destLower.includes("goa")) {
        return [
            { day: 1, title: "North Goa Beach & Fort Aguada", act: ["10:00 AM: Fort Aguada & Lighthouse Visit", "01:30 PM: Shacks Seafood Lunch at Baga", "04:30 PM: Water Sports & Parasailing"] },
            { day: 2, title: "Old Goa Heritage Churches & Spice Farm", act: ["09:30 AM: Basilica of Bom Jesus Tour", "01:00 PM: Tropical Spice Plantation Lunch", "05:00 PM: Mandovi River Sunset Cruise"] },
            { day: 3, title: "South Goa Palolem Beach & Chill", act: ["10:30 AM: Palolem Beach Kayaking", "02:00 PM: Beachfront Cafe Lunch", "07:30 PM: Night Market & Live Music"] }
        ];
    } else if (destLower.includes("leh") || destLower.includes("ladakh")) {
        return [
            { day: 1, title: "Leh Arrival & Acclimatization", act: ["09:00 AM: Hotel Rest & Oxygen Acclimatization", "02:00 PM: Leh Palace & Shanti Stupa", "06:00 PM: Local Leh Market Walk"] },
            { day: 2, title: "Nubra Valley via Khardung La Pass", act: ["08:00 AM: Drive through Khardung La (17,582 ft)", "01:30 PM: Diskit Monastery & Buddha Statue", "04:30 PM: Double-Humped Camel Safari at Hunder"] },
            { day: 3, title: "Pangong Tso Lake Camping", act: ["09:00 AM: Scenic Drive to Pangong Tso", "01:00 PM: Lakeside Photography & Lunch", "07:00 PM: Stargazing at High Altitude Camp"] }
        ];
    } else {
        // Default Rajasthani Heritage Itinerary
        return [
            { day: 1, title: "Arrival & Fort Exploration", act: ["09:00 AM: Hotel Check-in & Breakfast", "11:30 AM: Amber Fort Guided Tour", "01:30 PM: Rajasthani Thali Lunch", "04:30 PM: Jal Mahal Sunset Photography"] },
            { day: 2, title: "Palaces & Old City Bazaar", act: ["09:30 AM: City Palace & Jantar Mantar", "12:00 PM: Hawa Mahal (Palace of Winds)", "04:00 PM: Johari Bazaar Handicrafts", "08:00 PM: Cultural Folk Night"] },
            { day: 3, title: "Nahargarh Fort & Local Flavors", act: ["10:00 AM: Nahargarh Fort Viewpoint", "01:00 PM: Local Food Tasting & Lassi", "05:00 PM: Heritage Walk & Shopping", "08:30 PM: Farewell Group Dinner"] }
        ];
    }
}

/**
 * Primary Trip Generator & Workspace Updater
 */
async function generateTrip() {
    const destinationInput = document.getElementById("destination");
    const daysInput = document.getElementById("days");
    const budgetInput = document.getElementById("budget");
    const travelersInput = document.getElementById("travelers");
    const interestInput = document.getElementById("interest");

    const destination = (destinationInput && destinationInput.value.trim()) || "Jaipur, Rajasthan";
    const days = (daysInput && daysInput.value) || "5";
    const budget = (budgetInput && budgetInput.value) || "50000";
    const travelers = (travelersInput && travelersInput.value) || "3";
    const interest = (interestInput && interestInput.value) || "Heritage & Royalty";

    // 1. Update Live Summary Dashboard Cards
    const showDest = document.getElementById("showDestination");
    const showDaysEl = document.getElementById("showDays");
    const showTrav = document.getElementById("showTravelers");
    const showBudg = document.getElementById("showBudget");

    if (showDest) showDest.textContent = destination;
    if (showDaysEl) showDaysEl.textContent = days + " Days";
    if (showTrav) showTrav.textContent = travelers + " Travelers";
    if (showBudg) showBudg.textContent = "₹" + Number(budget).toLocaleString("en-IN");

    // 2. Update Smart Budget Breakdown
    const totalB = Number(budget);
    const spentB = Math.round(totalB * 0.65);
    const remainingB = totalB - spentB;

    const totalBudgetEl = document.getElementById("totalBudget");
    const spentBudgetEl = document.getElementById("spentBudget");
    const remainingBudgetEl = document.getElementById("remainingBudget");

    if (totalBudgetEl) totalBudgetEl.textContent = "₹" + totalB.toLocaleString("en-IN");
    if (spentBudgetEl) spentBudgetEl.textContent = "₹" + spentB.toLocaleString("en-IN");
    if (remainingBudgetEl) remainingBudgetEl.textContent = "₹" + remainingB.toLocaleString("en-IN");

    // 3. Render Custom Day-wise Itinerary Cards
    const dayContainer = document.getElementById("dayContainer");
    if (dayContainer) {
        const itinData = getIndianItinerary(destination, days);
        dayContainer.innerHTML = "";

        itinData.forEach(item => {
            const card = document.createElement("div");
            card.className = "day-card";
            card.innerHTML = `
                <div class="day-header">
                    <span class="day-badge">Day ${item.day}</span>
                    <h3>${item.title}</h3>
                </div>
                <ul class="activity-list">
                    ${item.act.map(a => `<li><i class="fa-solid fa-check-circle icon-amber"></i> ${a}</li>`).join('')}
                </ul>
            `;
            dayContainer.appendChild(card);
        });
    }

    // 4. Connect to Odoo Backend if script_api functions exist
    if (typeof createOdooTrip === "function") {
        createOdooTrip({ destination, days, budget, travelers, interest });
    }

    // 5. Smooth Scroll to Dashboard
    const dashboard = document.getElementById("dashboard");
    if (dashboard) {
        dashboard.scrollIntoView({ behavior: "smooth" });
    }
}
