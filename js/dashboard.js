// ================================
// 4Seed Portal API Service
// ================================

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw9P5iUDKYl3nXAaFfTdEO_rf7PfHSiLkwTjXq7HIpic7tOdg85aqIIeexbF63qrzIU/exec";

const partnerRaw = localStorage.getItem("partner");
const partner = partnerRaw ? JSON.parse(partnerRaw) : null;

if (!partner) {
    window.location.href = "login.html";
}

// Safely set UI elements if they exist
const elPartnerName = document.getElementById("partnerName");
const elPartnerId = document.getElementById("partnerId");
const elSponsorName = document.getElementById("sponsorName");
const elWelcomeTitle = document.getElementById("welcomeTitle");
const elLogoutBtn = document.getElementById("logoutBtn");

if (elPartnerName) elPartnerName.textContent = partner.name || "";
if (elPartnerId) elPartnerId.textContent = partner.partnerId || "";
if (elSponsorName) elSponsorName.textContent = partner.sponsorName || "";
if (elWelcomeTitle) elWelcomeTitle.textContent = "Welcome Back, " + (partner.name || "") + " 👋";

// Consolidated logout handler (confirm once)
if (elLogoutBtn) {
    elLogoutBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("partner");
            window.location.href = "login.html";
        }
    });
}

function openWithdraw() {
    const popup = document.getElementById("withdrawPopup");
    if (popup) popup.style.display = "flex";
}

function closeWithdraw() {
    const popup = document.getElementById("withdrawPopup");
    if (popup) popup.style.display = "none";
}

function sendWithdrawRequest() {
    const amountEl = document.getElementById("withdrawAmount");
    const amountVal = amountEl ? amountEl.value.trim() : "";

    if (!amountVal) {
        alert("Please enter an amount");
        return;
    }
    const amountNum = Number(amountVal);
    if (isNaN(amountNum) || amountNum <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8", "Accept": "application/json" },
        body: JSON.stringify({
            action: "withdrawRequest",
            partnerId: partner.partnerId,
            name: partner.name,
            amount: amountNum
        })
    })
    .then(res => {
        // API might return JSON or text; try JSON first
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) return res.json();
        return res.text();
    })
    .then(data => {
        if (typeof data === "object") {
            alert(data.message || JSON.stringify(data));
        } else {
            alert(data);
        }
    })
    .catch(err => {
        console.error("Withdraw request failed:", err);
        alert("Withdraw request failed. Please try again.");
    });
}

// ====================================
// Dashboard Statistics
// ====================================

if (elWelcomeTitle) elWelcomeTitle.innerHTML = "Welcome, " + (partner.name || "") + " 👋";
const elWalletBalance = document.getElementById("walletBalance");
const elBusinessVolume = document.getElementById("businessVolume");
const elRankName = document.getElementById("rankName");

if (elWalletBalance) elWalletBalance.innerHTML = "₹0";
if (elBusinessVolume) elBusinessVolume.innerHTML = "₹0";
if (elRankName) elRankName.innerHTML = "Starter";

const elTeamCount = document.getElementById("teamCount");

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
    if (data && data.success) {
        if (elTeamCount) elTeamCount.textContent = (Array.isArray(data.team) ? data.team.length : 0);
    }
})
.catch(error => {
    console.error("Error fetching team for dashboard:", error);
});
