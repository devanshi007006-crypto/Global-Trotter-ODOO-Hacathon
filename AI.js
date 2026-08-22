const activities = [ 
  // GOA

  {
    name: "Baga Beach",
    destination: "goa",
    category: "Beach",
    cost: 0,
    rating: 5
  },

  {
    name: "Scuba Diving",
    destination: "goa",
    category: "Adventure",
    cost: 2500,
    rating: 5
  },

  {
    name: "Fort Aguada",
    destination: "goa",
    category: "History",
    cost: 500,
    rating: 4
  },

  {
    name: "Water Sports",
    destination: "goa",
    category: "Adventure",
    cost: 2000,
    rating: 5
  },

  {
    name: "Goan Food Tour",
    destination: "goa",
    category: "Food",
    cost: 1200,
    rating: 5
  },

  {
    name: "Dudhsagar Falls",
    destination: "goa",
    category: "Nature",
    cost: 1800,
    rating: 5
  },

  {
    name: "Local Shopping",
    destination: "goa",
    category: "Shopping",
    cost: 1500,
    rating: 4
  },

  // PARIS
  {
    name: "Eiffel Tower",
    destination: "paris",
    category: "History",
    cost: 3000,
    rating: 5
  },

  {
    name: "Louvre Museum",
        destination: "paris",
        category: "History",
        cost: 2500,
        rating: 5
    },

    {
        name: "French Food Tour",
        destination: "paris",
        category: "Food",
        cost: 2000,
        rating: 5
    },

  {
        name: "Seine River Cruise",
        destination: "paris",
        category: "Adventure",
        cost: 3500,
        rating: 4
    },

    {
        name: "Paris Shopping",
        destination: "paris",
        category: "Shopping",
        cost: 3000,
        rating: 4
    },

  // TOKYO
    {
        name: "Tokyo Tower",
        destination: "tokyo",
        category: "History",
        cost: 2000,
        rating: 5
    },

    {
        name: "Sushi Food Tour",
        destination: "tokyo",
        category: "Food",
        cost: 2500,
        rating: 5
    },

   {
        name: "Tokyo Shopping",
        destination: "tokyo",
        category: "Shopping",
        cost: 3000,
        rating: 4
    },

    {
        name: "Mount Fuji Trip",
        destination: "tokyo",
        category: "Nature",
        cost: 5000,
        rating: 5
    }
];

// AI Reccomendation Score
 if (
        activity.category.toLowerCase() ===
        interest.toLowerCase()
    ) {
        score += 50;
    }

score += activity.rating * 5;

 if (activity.cost <= dailyBudget) {

        score += 30;

    } else if (activity.cost <= dailyBudget + 1000) {

        score += 10;
    }

    return score;
}


function getRecommendations(destination, interest, dailyBudget) {

    let destinationActivities = activities.filter(
        activity =>
            activity.destination === destination.toLowerCase()
    );

    destinationActivities.forEach(activity => {

        activity.score = calculateRecommendationScore(
            activity,
            interest,
            dailyBudget
        );

    });

   destinationActivities.sort(
        (a, b) => b.score - a.score
    );

    return destinationActivities;
}


function generateTrip() {

    const destination =
        document.getElementById("destination").value.trim();

    const days =
        parseInt(document.getElementById("days").value);

    const budget =
        parseInt(document.getElementById("budget").value);

    const travelers =
        parseInt(document.getElementById("travelers").value);

    const interest =
        document.getElementById("interest").value;


    if (!destination) {

        alert("Please enter your destination.");
        return;
    }

    if (!days || days < 1) {

        alert("Please enter valid number of days.");
        return;
    }

    if (!budget || budget < 1) {

        alert("Please enter valid budget.");
        return;
    }

    if (!travelers || travelers < 1) {

        alert("Please enter number of travelers.");
        return;
    }





  
    

  
  
