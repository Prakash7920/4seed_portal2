const partner = JSON.parse(localStorage.getItem("partner"));

if (!partner) {
    window.location.href = "login.html";
}

document.getElementById("partnerName").textContent =
    partner.name;

document.getElementById("partnerId").textContent =
    partner.partnerId;

document.getElementById("sponsorName").textContent =
    partner.sponsorName;

// Welcome Message
document.getElementById("welcomeTitle").textContent =
"Welcome Back, " + partner.name + " 👋";

document.getElementById("logoutBtn").addEventListener("click", function () {

    localStorage.removeItem("partner");

    window.location.href = "login.html";

});
document.getElementById("logoutBtn").addEventListener("click", function () {

    if (confirm("Are you sure you want to logout?")) {

    localStorage.removeItem("partner");

    window.location.href = "login.html";

    }
});
function openWithdraw(){

    document.getElementById("withdrawPopup").style.display="flex";

}

function closeWithdraw(){

    document.getElementById("withdrawPopup").style.display="none";

}
function sendWithdrawRequest(){
alert("Button clicked");

}
    const amount = document.getElementById("withdrawAmount").value;

    fetch(WEB_APP_URL,{
        method:"POST",
        body:JSON.stringify({
            action:"withdrawRequest",
            partnerId:partner.partnerId,
            name:partner.name,
            amount:amount
        })
    })
    .then(res=>res.text())
    .then(data=>{
        alert(data);
    })
    .catch(err=>{
        alert(err);
    });

}

// ====================================
// Dashboard Statistics
// ====================================

document.getElementById("welcomeTitle").innerHTML =
"Welcome, " + partner.name + " 👋";

document.getElementById("walletBalance").innerHTML = "₹0";

document.getElementById("businessVolume").innerHTML = "₹0";

document.getElementById("rankName").innerHTML = "Starter";

fetch("https://script.google.com/macros/s/AKfycbw9P5iUDKYl3nXAaFfTdEO_rf7PfHSiLkwTjXq7HIpic7tOdg85aqIIeexbF63qrzIU/exec", {
    method: "POST",
    body: JSON.stringify({
        action: "getTeam",
        partnerId: partner.partnerId
    })
})
.then(res => res.json())
.then(data => {

    if (data.success) {

        document.getElementById("teamCount").textContent =
            data.team.length;

    }

})
.catch(error => console.log(error));
