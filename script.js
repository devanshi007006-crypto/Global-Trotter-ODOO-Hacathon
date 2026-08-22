/**
 * GlobalTrotter India - Travel & Trip Management Engine
 * Handles Destination Presets, Category Filtering, Itinerary Generation & Group Debt Settlement
 */

/**
 * Quick-select a destination card to populate trip form
 */
function quickSelectDest(destination, days, budget, interest) {
    const destInput = document.getElementById("destination");
    const daysInput = document.getElementById("days");
    const budgetInput = document.getElementById("budget");

    if (destInput) destInput.value = destination;
    if (daysInput) daysInput.value = days;
    if (budgetInput) budgetInput.value = budget;

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
function filterCategory(category, clickedElement) {
    const chips = document.querySelectorAll(".chip");
    chips.forEach(chip => chip.classList.remove("active"));

    if (clickedElement) {
        clickedElement.classList.add("active");
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
            { day: 1, title: "Cochin Arrival & Heritage Fort Kochi", weather: "☀️ Sunny 29°C", act: [
                { time: "09:00 AM", title: "St. Francis Church & Chinese Nets", tag: "Heritage", tagClass: "tag-purple" },
                { time: "01:00 PM", title: "Coastal Seafood Thali Lunch", tag: "Culinary", tagClass: "tag-amber" },
                { time: "04:30 PM", title: "Kathakali Cultural Dance Show", tag: "Culture", tagClass: "tag-pink" }
            ]},
            { day: 2, title: "Alleppey Houseboat Backwater Cruise", weather: "🌴 Tropical 27°C", act: [
                { time: "10:00 AM", title: "Private Houseboat Boarding", tag: "Hospitality", tagClass: "tag-blue" },
                { time: "01:30 PM", title: "Traditional Karimeen Meals on Board", tag: "Culinary", tagClass: "tag-amber" },
                { time: "05:00 PM", title: "Village Canoe Tour & Sunset", tag: "Sightseeing", tagClass: "tag-cyan" }
            ]},
            { day: 3, title: "Munnar Tea Gardens & Spice Plantation", weather: "🌧️ Mist 22°C", act: [
                { time: "09:30 AM", title: "Tea Plantation Walk & Tasting", tag: "Nature", tagClass: "tag-emerald" },
                { time: "02:00 PM", title: "Spice Garden Guided Tour", tag: "Nature", tagClass: "tag-emerald" },
                { time: "06:00 PM", title: "Ayurvedic Wellness Massage", tag: "Wellness", tagClass: "tag-purple" }
            ]}
        ];
    } else if (destLower.includes("goa")) {
        return [
            { day: 1, title: "North Goa Beach & Fort Aguada", weather: "☀️ Sun 31°C", act: [
                { time: "10:00 AM", title: "Fort Aguada & Lighthouse Visit", tag: "Heritage", tagClass: "tag-purple" },
                { time: "01:30 PM", title: "Shacks Seafood Lunch at Baga", tag: "Culinary", tagClass: "tag-amber" },
                { time: "04:30 PM", title: "Water Sports & Parasailing", tag: "Adventure", tagClass: "tag-cyan" }
            ]},
            { day: 2, title: "Old Goa Heritage Churches & Spice Farm", weather: "🌤️ Breeze 28°C", act: [
                { time: "09:30 AM", title: "Basilica of Bom Jesus Tour", tag: "Heritage", tagClass: "tag-purple" },
                { time: "01:00 PM", title: "Tropical Spice Plantation Lunch", tag: "Culinary", tagClass: "tag-amber" },
                { time: "05:00 PM", title: "Mandovi River Sunset Cruise", tag: "Sightseeing", tagClass: "tag-blue" }
            ]},
            { day: 3, title: "South Goa Palolem Beach & Chill", weather: "☀️ Clear 30°C", act: [
                { time: "10:30 AM", title: "Palolem Beach Kayaking", tag: "Adventure", tagClass: "tag-cyan" },
                { time: "02:00 PM", title: "Beachfront Cafe Lunch", tag: "Dining", tagClass: "tag-pink" },
                { time: "07:30 PM", title: "Night Market & Live Music", tag: "Culture", tagClass: "tag-amber" }
            ]}
        ];
    } else if (destLower.includes("leh") || destLower.includes("ladakh")) {
        return [
            { day: 1, title: "Leh Arrival & Acclimatization", weather: "🏔️ Cold 14°C", act: [
                { time: "09:00 AM", title: "Hotel Rest & Oxygen Acclimatization", tag: "Wellness", tagClass: "tag-blue" },
                { time: "02:00 PM", title: "Leh Palace & Shanti Stupa", tag: "Heritage", tagClass: "tag-purple" },
                { time: "06:00 PM", title: "Local Leh Market Walk", tag: "Shopping", tagClass: "tag-pink" }
            ]},
            { day: 2, title: "Nubra Valley via Khardung La Pass", weather: "❄️ Snow Pass 8°C", act: [
                { time: "08:00 AM", title: "Drive Khardung La Pass (17,582 ft)", tag: "Adventure", tagClass: "tag-cyan" },
                { time: "01:30 PM", title: "Diskit Monastery & Giant Buddha", tag: "Spiritual", tagClass: "tag-emerald" },
                { time: "04:30 PM", title: "Hunder Double-Humped Camel Safari", tag: "Nature", tagClass: "tag-amber" }
            ]},
            { day: 3, title: "Pangong Tso Lake Camping", weather: "🌬️ Windy 12°C", act: [
                { time: "09:00 AM", title: "Scenic Drive to Pangong Tso", tag: "Sightseeing", tagClass: "tag-blue" },
                { time: "01:00 PM", title: "Lakeside Photography & Lunch", tag: "Sightseeing", tagClass: "tag-cyan" },
                { time: "07:00 PM", title: "Stargazing at High Altitude Camp", tag: "Nature", tagClass: "tag-purple" }
            ]}
        ];
    } else {
        // Default Rajasthani Heritage Itinerary
        return [
            { day: 1, title: "Arrival & Fort Exploration", weather: "☀️ Sunny 28°C", act: [
                { time: "09:00 AM", title: "Hotel Check-in & Breakfast", tag: "Hospitality", tagClass: "tag-blue" },
                { time: "11:30 AM", title: "Amber Fort Guided Tour", tag: "Heritage", tagClass: "tag-purple" },
                { time: "01:30 PM", title: "Traditional Rajasthani Thali Lunch", tag: "Culinary", tagClass: "tag-amber" },
                { time: "04:30 PM", title: "Jal Mahal Sunset Photography", tag: "Sightseeing", tagClass: "tag-cyan" }
            ]},
            { day: 2, title: "Palaces & Old City Bazaar", weather: "🌤️ Pleasant 26°C", act: [
                { time: "09:30 AM", title: "City Palace & Jantar Mantar", tag: "Heritage", tagClass: "tag-purple" },
                { time: "12:00 PM", title: "Hawa Mahal (Palace of Winds)", tag: "Sightseeing", tagClass: "tag-cyan" },
                { time: "04:00 PM", title: "Johari Bazaar Local Handicrafts", tag: "Shopping", tagClass: "tag-pink" },
                { time: "08:00 PM", title: "Chokhi Dhani Cultural Night", tag: "Culture", tagClass: "tag-amber" }
            ]},
            { day: 3, title: "Nahargarh Fort & Local Flavors", weather: "☀️ Clear Sky 29°C", act: [
                { time: "10:00 AM", title: "Nahargarh Fort Sunset Viewpoint", tag: "Sightseeing", tagClass: "tag-purple" },
                { time: "01:00 PM", title: "LMB Sweet Shop & Local Lassi", tag: "Culinary", tagClass: "tag-amber" },
                { time: "05:00 PM", title: "Heritage Spa & Relaxation", tag: "Wellness", tagClass: "tag-emerald" },
                { time: "08:30 PM", title: "Farewell Group Dinner", tag: "Dining", tagClass: "tag-pink" }
            ]}
        ];
    }
}

/**
 * Trigger Odoo What-If Trip Optimizer Simulation
 */
function triggerWhatIfOptimize() {
    alert("⚡ Odoo 'What-If' Trip Optimizer Activated!\n\nSimulating 15% budget reduction & swapping outdoor activities to rain-safe experiences...");
    const dest = document.getElementById("destination").value || "Jaipur, Rajasthan";
    const currentBudget = Number(document.getElementById("budget").value || 50000);
    const optimizedBudget = Math.round(currentBudget * 0.85);

    document.getElementById("budget").value = optimizedBudget;
    generateTrip();
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

    // 2. Update Smart Budget Breakdown & Progress Bar
    const totalB = Number(budget);
    const spentB = Math.round(totalB * 0.65);
    const remainingB = totalB - spentB;

    const totalBudgetEl = document.getElementById("totalBudget");
    const spentBudgetEl = document.getElementById("spentBudget");
    const remainingBudgetEl = document.getElementById("remainingBudget");

    if (totalBudgetEl) totalBudgetEl.textContent = "₹" + totalB.toLocaleString("en-IN");
    if (spentBudgetEl) spentBudgetEl.textContent = "₹" + spentB.toLocaleString("en-IN");
    if (remainingBudgetEl) remainingBudgetEl.textContent = "₹" + remainingB.toLocaleString("en-IN");

    const progressBarFill = document.getElementById("progressBarFill");
    const budgetPercentText = document.getElementById("budgetPercentText");
    if (progressBarFill) progressBarFill.style.width = "65%";
    if (budgetPercentText) budgetPercentText.textContent = "65% Spent (₹" + spentB.toLocaleString("en-IN") + " of ₹" + totalB.toLocaleString("en-IN") + ")";

    // 3. Render Custom Day-wise Itinerary Cards
    const dayContainer = document.getElementById("dayContainer");
    if (dayContainer) {
        const itinData = getIndianItinerary(destination, days);
        dayContainer.innerHTML = "";

        itinData.forEach(item => {
            const card = document.createElement("div");
            card.className = "day-card glass-panel";
            card.innerHTML = `
                <div class="day-header">
                    <span class="day-badge">Day ${item.day}</span>
                    <div>
                        <h3>${item.title}</h3>
                        <span class="weather-badge">${item.weather}</span>
                    </div>
                </div>
                <ul class="activity-list">
                    ${item.act.map(a => `
                        <li>
                            <div class="act-time"><i class="fa-solid fa-clock"></i> ${a.time}</div>
                            <div class="act-text"><strong>${a.title}</strong> <span class="tag-pill ${a.tagClass}">${a.tag}</span></div>
                        </li>
                    `).join('')}
                </ul>
            `;
            dayContainer.appendChild(card);
        });
    }

    // 4. Connect to Odoo Backend if script_api functions exist
    if (typeof createOdooTrip === "function") {
        try {
            createOdooTrip({ destination, days, budget, travelers, interest });
        } catch (e) {
            console.log("Odoo script_api fallback:", e);
        }
    }

    // 5. Smooth Scroll to Dashboard
    const dashboard = document.getElementById("dashboard");
    if (dashboard) {
        dashboard.scrollIntoView({ behavior: "smooth" });
    }
}
