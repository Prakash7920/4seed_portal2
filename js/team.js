const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw9P5iUDKYl3nXAaFfTdEO_rf7PfHSiLkwTjXq7HIpic7tOdg85aqIIeexbF63qrzIU/exec";

const partnerRaw = localStorage.getItem("partner");
const partner = partnerRaw ? JSON.parse(partnerRaw) : null;

if (!partner) {
    location.href = "login.html";
}

let navigationStack = [];
let currentPartnerId = partner.partnerId || "";
let selectedPartnerId = "";

// Safe references
const elMyName = document.getElementById("myName");
const elMyId = document.getElementById("myId");
if (elMyName) elMyName.textContent = partner.name || "";
if (elMyId) elMyId.textContent = "Partner ID : " + (partner.partnerId || "");

// Helper to safely update slot element
function updateSlotElement(slotEl, member) {
    if (!slotEl) return;
    if (member) {
        slotEl.innerHTML = `
            <div class="member-card">
                <div class="avatar">👤</div>
                <b>${member.name}</b><br>
                🆔 ${member.partnerId}<br>
                👥 ${member.directTeam || 0} Direct<br>
                💰 ₹${member.wallet != null ? member.wallet : 0}<br>
                🟢 ${member.status || 'Blocked'}<br>
                🏆 ${member.rank || '—'}
            </div>
        `;
        slotEl.dataset.name = member.name || "";
        slotEl.dataset.partnerId = member.partnerId || "";
    } else {
        slotEl.innerHTML = `
            <div class="empty-slot">
                <div class="plus">+</div>
                <div>Empty Slot</div>
            </div>
        `;
        delete slotEl.dataset.name;
        delete slotEl.dataset.partnerId;
    }
}

// Initial load of team
function renderTeamFromData(team) {
    const safeTeam = Array.isArray(team) ? team : [];
    const directCountEl = document.getElementById("directCount");
    const emptyCountEl = document.getElementById("emptyCount");
    if (directCountEl) directCountEl.textContent = safeTeam.length;
    if (emptyCountEl) emptyCountEl.textContent = Math.max(0, 5 - safeTeam.length);

    for (let i = 0; i < 5; i++) {
        const slot = document.getElementById("slot" + (i + 1));
        updateSlotElement(slot, safeTeam[i]);
    }
}

fetch(WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=utf-8", "Accept": "application/json" },
    body: JSON.stringify({
        action: "getTeam",
        partnerId: partner.partnerId
    })
})
.then(res => res.json())
.then(data => {
    const team = (data && Array.isArray(data.team)) ? data.team : [];
    renderTeamFromData(team);
})
.catch(err => {
    console.error("Error loading team:", err);
});

// Load team for a given partnerId (used for navigation)
function loadTeamByPartnerId(partnerId) {
    if (!partnerId) return;
    fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8", "Accept": "application/json" },
        body: JSON.stringify({
            action: "getTeam",
            partnerId: partnerId
        })
    })
    .then(res => res.json())
    .then(data => {
        const team = (data && Array.isArray(data.team)) ? data.team : [];
        const directCountEl = document.getElementById("directCount");
        const emptyCountEl = document.getElementById("emptyCount");
        if (directCountEl) directCountEl.textContent = team.length;
        if (emptyCountEl) emptyCountEl.textContent = Math.max(0, 5 - team.length);

        for (let i = 0; i < 5; i++) {
            const slot = document.getElementById("slot" + (i + 1));
            updateSlotElement(slot, team[i]);
        }
    })
    .catch(err => console.error("Error loading team by partnerId:", err));
}

function loadTeam(card) {
    if (!card) return;
    const partnerId = card.dataset.partnerId;
    selectedPartnerId = partnerId || "";
    if (!partnerId) return;

    const popupName = document.getElementById("popupName");
    const popupId = document.getElementById("popupId");
    const popupSponsor = document.getElementById("popupSponsor");
    if (popupName) popupName.textContent = card.dataset.name || "";
    if (popupId) popupId.textContent = "Partner ID : " + partnerId;
    if (popupSponsor) popupSponsor.textContent = "Sponsor : " + (partner.partnerId || "");
    const memberPopup = document.getElementById("memberPopup");
    if (memberPopup) memberPopup.style.display = "flex";
}

function closePopup() {
    const memberPopup = document.getElementById("memberPopup");
    if (memberPopup) memberPopup.style.display = "none";
}

function viewDownline() {
    closePopup();
    navigationStack.push(currentPartnerId);
    currentPartnerId = selectedPartnerId;
    loadTeamByPartnerId(selectedPartnerId);
}

function goHome() {
    navigationStack = [];
    currentPartnerId = partner.partnerId || "";
    loadTeamByPartnerId(partner.partnerId);
}
