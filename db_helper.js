/**
 * GlobalTrotter Database Persistence Engine
 * Automatically saves user inputs, trips, itineraries, expenses, and community posts.
 */

const GT_DB = {
    // Save User Registration / Account Record
    saveUserAccount: function(userObj) {
        const accounts = JSON.parse(localStorage.getItem("gt_accounts") || "[]");
        const idx = accounts.findIndex(a => a.email === userObj.email);
        if (idx >= 0) {
            accounts[idx] = userObj;
        } else {
            accounts.push(userObj);
        }
        localStorage.setItem("gt_accounts", JSON.stringify(accounts));
        this.logRecord("User Account", userObj);
    },

    // Save New Trip Record
    saveTrip: function(tripObj) {
        const trips = JSON.parse(localStorage.getItem("gt_trips") || "[]");
        trips.push(tripObj);
        localStorage.setItem("gt_trips", JSON.stringify(trips));
        this.logRecord("Trip Record", tripObj);
    },

    // Save Itinerary Section Cards
    saveItinerarySections: function(sectionsArray) {
        localStorage.setItem("gt_saved_itinerary_sections", JSON.stringify(sectionsArray));
        this.logRecord("Itinerary Sections", sectionsArray);
    },

    // Save Community Post
    saveCommunityPost: function(postObj) {
        const posts = JSON.parse(localStorage.getItem("gt_community_posts") || "[]");
        posts.unshift(postObj);
        localStorage.setItem("gt_community_posts", JSON.stringify(posts));
        this.logRecord("Community Post", postObj);
    },

    // Global Log of All User Records
    logRecord: function(type, recordData) {
        const allRecords = JSON.parse(localStorage.getItem("gt_all_database_records") || "[]");
        allRecords.push({
            type: type,
            timestamp: new Date().toISOString(),
            data: recordData
        });
        localStorage.setItem("gt_all_database_records", JSON.stringify(allRecords));
        console.log(`[GT_DB PERSISTED] ${type}:`, recordData);
    }
};

// Export to window for global access
window.GT_DB = GT_DB;
