const partner = JSON.parse(localStorage.getItem("partner"));

let navigationStack = [];
let currentPartnerId = partner.partnerId;
let selectedPartnerId = "";

if (!partner) {
    location.href = "login.html";
}

document.getElementById("myName").textContent = partner.name;
document.getElementById("myId").textContent =
"Partner ID : " + partner.partnerId;

// Load Team
fetch("https://script.google.com/macros/s/AKfycbw9P5iUDKYl3nXAaFfTdEO_rf7PfHSiLkwTjXq7HIpic7tOdg85aqIIeexbF63qrzIU/exec", {
    method: "POST",
    body: JSON.stringify({
        action: "getTeam",
        partnerId: partner.partnerId
    })
})
.then(res => res.json())
.then(data => {

    document.getElementById("directCount").textContent = data.team.length;
    document.getElementById("emptyCount").textContent = 5 - data.team.length;

    if (data.success) {

        for (let i = 0; i < 5; i++) {

            const slot = document.getElementById("slot" + (i + 1));

            if (data.team[i]) {

                slot.innerHTML = `
                    <b>${data.team[i].name}</b><br>
                    ${data.team[i].partnerId}
                `;
                slot.dataset.name = data.team[i].name;
                slot.dataset.partnerId = data.team[i].partnerId;
                
            } else {

                slot.innerHTML = `
                <div class="empty-slot">
                <div class="plus">+</div>
                <div>Empty Slot</div>
                </div>
                `;

            }

        }

    }

});

function loadTeamByPartnerId(partnerId){

    fetch("https://script.google.com/macros/s/AKfycbw9P5iUDKYl3nXAaFfTdEO_rf7PfHSiLkwTjXq7HIpic7tOdg85aqIIeexbF63qrzIU/exec",{
        method:"POST",
        body:JSON.stringify({
            action:"getTeam",
            partnerId:partnerId
        })
    })
    .then(res=>res.json())
    .then(data=>{

        document.getElementById("directCount").textContent = data.team.length;
        document.getElementById("emptyCount").textContent = 5 - data.team.length;

        for(let i=0;i<5;i++){

            const slot=document.getElementById("slot"+(i+1));

            if(data.team[i]){

                slot.innerHTML = `
<div class="member-card">

<div class="avatar">👤</div>

<b>${data.team[i].name}</b><br>

🆔 ${data.team[i].partnerId}<br>

👥 ${data.team[i].directTeam} Direct<br>

💰 ₹${data.team[i].wallet}<br>

🟢 ${data.team[i].status}<br>

🏆 ${data.team[i].rank}

</div>
`;

                slot.dataset.name=data.team[i].name;
                slot.dataset.partnerId=data.team[i].partnerId;

            }else{

                slot.innerHTML=`
                <div class="empty-slot">
                    <div class="plus">+</div>
                    <div>Empty Slot</div>
                </div>
                `;

                delete slot.dataset.name;
                delete slot.dataset.partnerId;
            }
        }
    });
}

function loadTeam(card){

    const partnerId = card.dataset.partnerId;
    selectedPartnerId = partnerId;

    if(!partnerId) return;

    document.getElementById("popupName").textContent = card.dataset.name;
    document.getElementById("popupId").textContent = "Partner ID : " + partnerId;
    document.getElementById("popupSponsor").textContent = "Sponsor : " + partner.partnerId;

    document.getElementById("memberPopup").style.display = "flex";
}
function closePopup(){
    document.getElementById("memberPopup").style.display = "none";
}

function viewDownline(){

    closePopup();
    navigationStack.push(currentPartnerId);
    currentPartnerId = selectedPartnerId;

    loadTeamByPartnerId(selectedPartnerId);
}

function goHome(){

    navigationStack = [];
    currentPartnerId = partner.partnerId;

    loadTeamByPartnerId(partner.partnerId);
}
