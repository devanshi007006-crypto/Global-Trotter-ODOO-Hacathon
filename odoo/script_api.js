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
