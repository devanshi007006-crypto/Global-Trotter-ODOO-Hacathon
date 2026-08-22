function generateTrip(){

    let destination = document.getElementById("destination").value;

    let days=document.getElementById("days").value;

    let budget=document.getElementById("budget").value;

    let travelers=document.getElementById("travelers").value;

    if(destination===""|| days===""||budget ===""||travelers===""){

        alert("please fill all trip details!");
            return;
        
    }

  document.getElementById("showDestination").innerText =
        destination;

    document.getElementById("showDays").innerText =
        days + " Days";

    document.getElementById("showTravelers").innerText =
        travelers + " People";

    document.getElementById("showBudget").innerText =
        "₹" + Number(budget).toLocaleString("en-IN");

    document.getElementById("totalBudget").innerText =
        "₹" + Number(budget).toLocaleString("en-IN");

    let estimatedSpent = Number(budget) * 0.65;

    let remaining = Number(budget) - estimatedSpent;

    document.getElementById("spentBudget").innerText =
        "₹" + Math.round(estimatedSpent).toLocaleString("en-IN");

    document.getElementById("remainingBudget").innerText =
        "₹" + Math.round(remaining).toLocaleString("en-IN");

    document.getElementById("dashboard").scrollIntoView({
        behavior: "smooth"
    }
);
}


