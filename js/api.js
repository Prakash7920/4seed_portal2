// ================================
// 4Seed Portal API Service
// ================================

const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbw9P5iUDKYl3nXAaFfTdEO_rf7PfHSiLkwTjXq7HIpic7tOdg85aqIIeexbF63qrzIU/exec";

// Verify Sponsor
async function verifySponsor(sponsorId){
    try {
        const url = WEB_APP_URL + "?action=verifySponsor&sponsorId=" + encodeURIComponent(sponsorId) + "&t=" + Date.now();
        const res = await fetch(url, {
            headers: { "Accept": "application/json" }
        });

        if(!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
        }

        return await res.json();
    } catch (err) {
        console.error('verifySponsor error:', err);
        return { success: false, error: err.message };
    }
}

// Register Partner
async function registerPartner(data){
    try {
        const response = await fetch(WEB_APP_URL,{
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });

        if(!response.ok){
            const text = await response.text();
            throw new Error(`HTTP ${response.status}: ${text}`);
        }

        return await response.json();
    } catch (err) {
        console.error('registerPartner error:', err);
        return { success: false, error: err.message };
    }
}
