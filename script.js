/**
 * GlobalTrotter India
 * Travel & Trip Management Engine
 */

/* =========================================
   QUICK SELECT DESTINATION
   ========================================= */

function quickSelectDest(destination, days, budget, interest) {

    const destInput = document.getElementById("destination");
    const daysInput = document.getElementById("days");
    const budgetInput = document.getElementById("tripBudget");
    const interestSelect = document.getElementById("interest");

    if (destInput) {
        destInput.value = destination;
    }

    if (daysInput) {
        daysInput.value = days;
    }

    if (budgetInput) {
        budgetInput.value = budget;
    }

    if (interestSelect) {

        for (let i = 0; i < interestSelect.options.length; i++) {

            if (
                interestSelect.options[i].text
                    .toLowerCase()
                    .includes(interest.toLowerCase().split(" ")[0])
            ) {
                interestSelect.selectedIndex = i;
                break;
            }
        }
    }

    const planner = document.getElementById("planner");

    if (planner) {
        planner.scrollIntoView({
            behavior: "smooth"
        });
    }
}


/* =========================================
   CATEGORY FILTER
   ========================================= */

function filterCategory(category, clickedElement) {

    const chips = document.querySelectorAll(".chip");

    chips.forEach(chip => {
        chip.classList.remove("active");
    });

    if (clickedElement) {
        clickedElement.classList.add("active");
    }

    const cards = document.querySelectorAll(".dest-card");

    cards.forEach(card => {

        const cardCategory = card.getAttribute("data-category");

        if (
            category === "all" ||
            cardCategory === category
        ) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}


/* =========================================
   INDIAN ITINERARY DATA
   ========================================= */

function getIndianItinerary(destination) {

    const destLower = destination.toLowerCase();


    /* =========================
       KERALA
       ========================= */

    if (
        destLower.includes("kerala") ||
        destLower.includes("alleppey") ||
        destLower.includes("munnar")
    ) {

        return [

            {
                day: 1,
                title: "Cochin Arrival & Fort Kochi",
                weather: "☀️ Sunny 29°C",
                act: [
                    {
                        time: "09:00 AM",
                        title: "St. Francis Church & Chinese Nets",
                        tag: "Heritage",
                        tagClass: "tag-purple"
                    },
                    {
                        time: "01:00 PM",
                        title: "Coastal Seafood Thali Lunch",
                        tag: "Culinary",
                        tagClass: "tag-amber"
                    },
                    {
                        time: "04:30 PM",
                        title: "Kathakali Cultural Dance Show",
                        tag: "Culture",
                        tagClass: "tag-pink"
                    }
                ]
            },

            {
                day: 2,
                title: "Alleppey Houseboat Backwater Cruise",
                weather: "🌴 Tropical 27°C",
                act: [
                    {
                        time: "10:00 AM",
                        title: "Private Houseboat Boarding",
                        tag: "Hospitality",
                        tagClass: "tag-blue"
                    },
                    {
                        time: "01:30 PM",
                        title: "Traditional Kerala Meals",
                        tag: "Culinary",
                        tagClass: "tag-amber"
                    },
                    {
                        time: "05:00 PM",
                        title: "Village Canoe Tour & Sunset",
                        tag: "Sightseeing",
                        tagClass: "tag-cyan"
                    }
                ]
            },

            {
                day: 3,
                title: "Munnar Tea Gardens",
                weather: "🌧️ Mist 22°C",
                act: [
                    {
                        time: "09:30 AM",
                        title: "Tea Plantation Walk & Tasting",
                        tag: "Nature",
                        tagClass: "tag-emerald"
                    },
                    {
                        time: "02:00 PM",
                        title: "Spice Garden Guided Tour",
                        tag: "Nature",
                        tagClass: "tag-emerald"
                    },
                    {
                        time: "06:00 PM",
                        title: "Ayurvedic Wellness Experience",
                        tag: "Wellness",
                        tagClass: "tag-purple"
                    }
                ]
            }
        ];
    }


    /* =========================
       GOA
       ========================= */

    if (destLower.includes("goa")) {

        return [

            {
                day: 1,
                title: "North Goa Beach & Fort Aguada",
                weather: "☀️ Sunny 31°C",
                act: [
                    {
                        time: "10:00 AM",
                        title: "Fort Aguada & Lighthouse Visit",
                        tag: "Heritage",
                        tagClass: "tag-purple"
                    },
                    {
                        time: "01:30 PM",
                        title: "Seafood Lunch at Baga",
                        tag: "Culinary",
                        tagClass: "tag-amber"
                    },
                    {
                        time: "04:30 PM",
                        title: "Water Sports & Beach Time",
                        tag: "Adventure",
                        tagClass: "tag-cyan"
                    }
                ]
            },

            {
                day: 2,
                title: "Old Goa Heritage Churches",
                weather: "🌤️ Pleasant 28°C",
                act: [
                    {
                        time: "09:30 AM",
                        title: "Basilica of Bom Jesus Tour",
                        tag: "Heritage",
                        tagClass: "tag-purple"
                    },
                    {
                        time: "01:00 PM",
                        title: "Spice Plantation Lunch",
                        tag: "Culinary",
                        tagClass: "tag-amber"
                    },
                    {
                        time: "05:00 PM",
                        title: "Mandovi River Sunset Cruise",
                        tag: "Sightseeing",
                        tagClass: "tag-blue"
                    }
                ]
            },

            {
                day: 3,
                title: "South Goa & Palolem Beach",
                weather: "☀️ Clear 30°C",
                act: [
                    {
                        time: "10:30 AM",
                        title: "Palolem Beach Kayaking",
                        tag: "Adventure",
                        tagClass: "tag-cyan"
                    },
                    {
                        time: "02:00 PM",
                        title: "Beachfront Cafe Lunch",
                        tag: "Dining",
                        tagClass: "tag-pink"
                    },
                    {
                        time: "07:30 PM",
                        title: "Night Market & Live Music",
                        tag: "Culture",
                        tagClass: "tag-amber"
                    }
                ]
            }
        ];
    }


    /* =========================
       LADAKH
       ========================= */

    if (
        destLower.includes("leh") ||
        destLower.includes("ladakh")
    ) {

        return [

            {
                day: 1,
                title: "Leh Arrival & Acclimatization",
                weather: "🏔️ Cold 14°C",
                act: [
                    {
                        time: "09:00 AM",
                        title: "Hotel Rest & Acclimatization",
                        tag: "Wellness",
                        tagClass: "tag-blue"
                    },
                    {
                        time: "02:00 PM",
                        title: "Leh Palace & Shanti Stupa",
                        tag: "Heritage",
                        tagClass: "tag-purple"
                    },
                    {
                        time: "06:00 PM",
                        title: "Leh Market Walk",
                        tag: "Shopping",
                        tagClass: "tag-pink"
                    }
                ]
            },

            {
                day: 2,
                title: "Nubra Valley via Khardung La",
                weather: "❄️ Snow Pass 8°C",
                act: [
                    {
                        time: "08:00 AM",
                        title: "Drive through Khardung La Pass",
                        tag: "Adventure",
                        tagClass: "tag-cyan"
                    },
                    {
                        time: "01:30 PM",
                        title: "Diskit Monastery",
                        tag: "Spiritual",
                        tagClass: "tag-emerald"
                    },
                    {
                        time: "04:30 PM",
                        title: "Hunder Camel Safari",
                        tag: "Nature",
                        tagClass: "tag-amber"
                    }
                ]
            },

            {
                day: 3,
                title: "Pangong Tso Lake",
                weather: "🌬️ Windy 12°C",
                act: [
                    {
                        time: "09:00 AM",
                        title: "Drive to Pangong Tso",
                        tag: "Sightseeing",
                        tagClass: "tag-blue"
                    },
                    {
                        time: "01:00 PM",
                        title: "Lakeside Photography",
                        tag: "Sightseeing",
                        tagClass: "tag-cyan"
                    },
                    {
                        time: "07:00 PM",
                        title: "Stargazing",
                        tag: "Nature",
                        tagClass: "tag-purple"
                    }
                ]
            }
        ];
    }


    /* =========================
       DEFAULT JAIPUR
       ========================= */

    return [

        {
            day: 1,
            title: "Arrival & Fort Exploration",
            weather: "☀️ Sunny 28°C",
            act: [
                {
                    time: "09:00 AM",
                    title: "Hotel Check-in & Breakfast",
                    tag: "Hospitality",
                    tagClass: "tag-blue"
                },
                {
                    time: "11:30 AM",
                    title: "Amber Fort Guided Tour",
                    tag: "Heritage",
                    tagClass: "tag-purple"
                },
                {
                    time: "01:30 PM",
                    title: "Traditional Rajasthani Thali",
                    tag: "Culinary",
                    tagClass: "tag-amber"
                },
                {
                    time: "04:30 PM",
                    title: "Jal Mahal Sunset Photography",
                    tag: "Sightseeing",
                    tagClass: "tag-cyan"
                }
            ]
        },

        {
            day: 2,
            title: "Palaces & Old City Bazaar",
            weather: "🌤️ Pleasant 26°C",
            act: [
                {
                    time: "09:30 AM",
                    title: "City Palace & Jantar Mantar",
                    tag: "Heritage",
                    tagClass: "tag-purple"
                },
                {
                    time: "12:00 PM",
                    title: "Hawa Mahal Photography",
                    tag: "Sightseeing",
                    tagClass: "tag-cyan"
                },
                {
                    time: "04:00 PM",
                    title: "Johari Bazaar Handicrafts",
                    tag: "Shopping",
                    tagClass: "tag-pink"
                },
                {
                    time: "08:00 PM",
                    title: "Chokhi Dhani Cultural Night",
                    tag: "Culture",
                    tagClass: "tag-amber"
                }
            ]
        },

        {
            day: 3,
            title: "Nahargarh Fort & Local Flavors",
            weather: "☀️ Clear Sky 29°C",
            act: [
                {
                    time: "10:00 AM",
                    title: "Nahargarh Fort Viewpoint",
                    tag: "Sightseeing",
                    tagClass: "tag-purple"
                },
                {
                    time: "01:00 PM",
                    title: "Local Sweets & Lassi",
                    tag: "Culinary",
                    tagClass: "tag-amber"
                },
                {
                    time: "05:00 PM",
                    title: "Heritage Spa & Relaxation",
                    tag: "Wellness",
                    tagClass: "tag-emerald"
                },
                {
                    time: "08:30 PM",
                    title: "Farewell Group Dinner",
                    tag: "Dining",
                    tagClass: "tag-pink"
                }
            ]
        }
    ];
}


/* =========================================
   WHAT-IF OPTIMIZER
   ========================================= */

function triggerWhatIfOptimize() {

    alert(
        "⚡ Odoo 'What-If' Trip Optimizer Activated!\n\n" +
        "Simulating 15% budget reduction..."
    );

    const budgetInput = document.getElementById("tripBudget");

    const currentBudget =
        Number(budgetInput?.value || 50000);

    const optimizedBudget =
        Math.round(currentBudget * 0.85);

    if (budgetInput) {
        budgetInput.value = optimizedBudget;
    }

    generateTrip();
}


/* =========================================
   GENERATE TRIP
   ========================================= */

function generateTrip() {

    const destinationInput =
        document.getElementById("destination");

    const daysInput =
        document.getElementById("days");

    const budgetInput =
        document.getElementById("tripBudget");

    const travelersInput =
        document.getElementById("travelers");

    const interestInput =
        document.getElementById("interest");


    const destination =
        destinationInput?.value.trim() ||
        "Jaipur, Rajasthan";

    const days =
        Number(daysInput?.value || 5);

    const budget =
        Number(budgetInput?.value || 50000);

    const travelers =
        Number(travelersInput?.value || 3);

    const interest =
        interestInput?.value ||
        "Heritage & Royalty";


    /* =========================================
       UPDATE DASHBOARD
       ========================================= */

    const showDestination =
        document.getElementById("showDestination");

    const showDays =
        document.getElementById("showDays");

    const showTravelers =
        document.getElementById("showTravelers");

    const showBudget =
        document.getElementById("showBudget");


    if (showDestination) {
        showDestination.textContent =
            destination;
    }

    if (showDays) {
        showDays.textContent =
            days + " Days";
    }

    if (showTravelers) {
        showTravelers.textContent =
            travelers + " Travelers";
    }

    if (showBudget) {
        showBudget.textContent =
            "₹" + budget.toLocaleString("en-IN");
    }


    /* =========================================
       BUDGET CALCULATION
       ========================================= */

    const totalBudget = budget;

    const spentBudget =
        Math.round(totalBudget * 0.65);

    const remainingBudget =
        totalBudget - spentBudget;


    const totalBudgetEl =
        document.getElementById("totalBudget");

    const spentBudgetEl =
        document.getElementById("spentBudget");

    const remainingBudgetEl =
        document.getElementById("remainingBudget");


    if (totalBudgetEl) {
        totalBudgetEl.textContent =
            "₹" + totalBudget.toLocaleString("en-IN");
    }

    if (spentBudgetEl) {
        spentBudgetEl.textContent =
            "₹" + spentBudget.toLocaleString("en-IN");
    }

    if (remainingBudgetEl) {
        remainingBudgetEl.textContent =
            "₹" + remainingBudget.toLocaleString("en-IN");
    }


    /* =========================================
       PROGRESS BAR
       ========================================= */

    const progressBarFill =
        document.getElementById("progressBarFill");

    const budgetPercentText =
        document.getElementById("budgetPercentText");


    if (progressBarFill) {
        progressBarFill.style.width = "65%";
    }

    if (budgetPercentText) {
        budgetPercentText.textContent =
            "65% Spent (₹" +
            spentBudget.toLocaleString("en-IN") +
            " of ₹" +
            totalBudget.toLocaleString("en-IN") +
            ")";
    }


    /* =========================================
       ITINERARY GENERATION
       ========================================= */

    const dayContainer =
        document.getElementById("dayContainer");


    if (dayContainer) {

        const baseItinerary =
            getIndianItinerary(destination);

        dayContainer.innerHTML = "";


        for (let i = 0; i < days; i++) {

            const baseDay =
                baseItinerary[i % baseItinerary.length];

            const dayNumber = i + 1;


            const card =
                document.createElement("div");

            card.className =
                "day-card glass-panel";


            card.innerHTML = `

                <div class="day-header">

                    <span class="day-badge">
                        Day ${dayNumber}
                    </span>

                    <div>

                        <h3>
                            ${baseDay.title}
                        </h3>

                        <span class="weather-badge">
                            ${baseDay.weather}
                        </span>

                    </div>

                </div>


                <ul class="activity-list">

                    ${baseDay.act.map(activity => `

                        <li>

                            <div class="act-time">

                                <i class="fa-solid fa-clock"></i>

                                ${activity.time}

                            </div>


                            <div class="act-text">

                                <strong>
                                    ${activity.title}
                                </strong>

                                <span class="tag-pill ${activity.tagClass}">
                                    ${activity.tag}
                                </span>

                            </div>

                        </li>

                    `).join("")}

                </ul>
            `;


            dayContainer.appendChild(card);
        }
    }


    /* =========================================
       ODOO BACKEND
       ========================================= */

    if (typeof createOdooTrip === "function") {

        try {

            createOdooTrip({
                destination,
                days,
                budget,
                travelers,
                interest
            });

        } catch (error) {

            console.log(
                "Odoo backend fallback:",
                error
            );
        }
    }


    /* =========================================
       SCROLL TO DASHBOARD
       ========================================= */

    const dashboard =
        document.getElementById("dashboard");

    if (dashboard) {

        dashboard.scrollIntoView({
            behavior: "smooth"
        });
    }
}

/* =========================================
   PAGE LOAD & AUTH CHECK
   ========================================= */

/**
 * Check User Auth state from localStorage on page load
 */
function checkUserAuth() {
    const userAuthLink = document.getElementById("userAuthLink");
    const storedUser = localStorage.getItem("gt_user");

    if (storedUser && userAuthLink) {
        try {
            const user = JSON.parse(storedUser);
            if (user && user.isLoggedIn) {
                userAuthLink.innerHTML = `<i class="fa-solid fa-circle-user"></i> Hi, ${user.name.split(' ')[0]}`;
                userAuthLink.href = "#";
                userAuthLink.onclick = function(e) {
                    e.preventDefault();
                    if (confirm(`Logged in as ${user.name} (${user.email}). Do you want to log out?`)) {
                        localStorage.removeItem("gt_user");
                        window.location.reload();
                    }
                };
            }
        } catch (e) {
            console.error("Auth state parse error:", e);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (typeof generateTrip === "function") {
        generateTrip();
    }
    checkUserAuth();
});

