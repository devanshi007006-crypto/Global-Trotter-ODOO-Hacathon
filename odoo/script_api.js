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
