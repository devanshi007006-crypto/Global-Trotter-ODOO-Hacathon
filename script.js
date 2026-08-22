function generateTrip(){

    let destination = document.getElementById("destination").value;

    let days=document.getElementById("days").value;

    let budget=document.getElementById("budget").value;

    let travelers=document.getElementById("travelers").value;

    if(destination===""|| days===""||budget ===""||travelers===""){

        alert("please fill all trip details!");
            return;
        
    }

    document.getElementById("showDestination").innerText=days + "Days";



}

