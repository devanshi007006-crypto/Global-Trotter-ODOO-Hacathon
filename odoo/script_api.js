const API_BASE_URL = "/api";

let currentTripId = null;

async function apiRequest(endpoint, method = "GET", data = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (data !== null) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(API_BASE_URL + endpoint, options);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "API request failed");
    }

    return result;
}

async function generateTrip() {
    const destination = document.getElementById("destination").value.trim();
    const days = parseInt(document.getElementById("days").value);
    const budget = parseFloat(document.getElementById("budget").value);
    const travelers = parseInt(document.getElementById("travelers").value);
    const interest = document.getElementById("interest").value;

    if (!destination) {
        alert("Please enter a destination.");
        return;
    }
    if (!days || days < 1) {
        alert("Number of days must be at least 1.");
        return;
    }
    if (!budget || budget < 1) {
        alert("Budget must be greater than 0.");
        return;
    }
}

if (!travelers || travelers < 1) {
        alert("Number of travelers must be at least 1.");
        return;
    }

    try {
        const result = await apiRequest("/trips", "POST", {
            destination,
            days,
            budget,
            travelers,
            interest
        });

        currentTripId = result.trip_id;

        await loadTrip(currentTripId);
        await loadItinerary();
        await loadBudget();
        await loadMembers();

        document.getElementById("dashboard").scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function loadTrip(tripId) {
    try {
        const result = await apiRequest(`/trips/${tripId}`);
        const trip = result.trip;

        document.getElementById("showDestination").textContent = trip.destination;
        document.getElementById("showDays").textContent = trip.days;
        document.getElementById("showTravelers").textContent = trip.travelers;
        document.getElementById("showBudget").textContent = formatCurrency(trip.budget);

    } 
    
    catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function updateTrip(updatedData) {
    if (!currentTripId) {
        alert("Please create a trip first.");
        return;
    }

    try {
        await apiRequest(
            `/trips/${currentTripId}`,
            "PUT",
            updatedData
        );

        await loadTrip(currentTripId);

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}
