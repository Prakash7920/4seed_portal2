const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw9P5iUDKYl3nXAaFfTdEO_rf7PfHSiLkwTjXq7HIpic7tOdg85aqIIeexbF63qrzIU/exec";

let allPartners = [];

fetch(WEB_APP_URL,{
    method:"POST",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body:JSON.stringify({
        action:"getAllPartners"
    })
})
.then(res=>res.json())
.then(data=>{
    if(data && data.success){
        allPartners = data.partners || [];
        loadPartners(allPartners);
    }
})
.catch(err=>{
    console.error('Error fetching partners:', err);
});

fetch(WEB_APP_URL,{
    method:"POST",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body:JSON.stringify({
        action:"getDashboardStats"
    })
})
.then(res=>res.json())
.then(data=>{
    if(data && data.success){
        document.getElementById("totalPartners").textContent = data.total ?? 0;
        document.getElementById("activePartners").textContent = data.active ?? 0;
        document.getElementById("blockedPartners").textContent = data.blocked ?? 0;
        document.getElementById("walletAmount").textContent = "₹" + (data.wallet ?? 0);
    }
})
.catch(err=>{
    console.error('Error fetching dashboard stats:', err);
});

function loadPartners(partners){
    const tbody = document.querySelector("#partnerTable tbody");
    if(!tbody) return;

    tbody.innerHTML = "";

    partners.forEach(partner=>{
        const status = partner.status || 'Blocked';
        const wallet = partner.wallet != null ? partner.wallet : 0;

        tbody.innerHTML += `
        <tr>
            <td>${partner.partnerId}</td>
            <td>${partner.name}</td>
            <td>₹${wallet}</td>
            <td>
                ${status}
                <br>
                <button onclick="toggleStatus('${partner.partnerId}','${status}')">
                    ${status=="Active" ? "Block" : "Unblock"}
                </button>
            </td>
            <td>
                <button onclick="editPartner('${partner.partnerId}','${partner.name}','${wallet}')">Edit</button>
            </td>
        </tr>
        `;
    });
}

function editPartner(id,name,wallet){
    const idEl = document.getElementById("editPartnerId");
    const nameEl = document.getElementById("editName");
    const walletEl = document.getElementById("editWallet");
    const popup = document.getElementById("editPopup");
    if(!idEl || !nameEl || !walletEl || !popup) return;

    idEl.value = id;
    nameEl.value = name;
    walletEl.value = wallet;

    popup.style.display = "flex";
}

function closePopup(){
    const popup = document.getElementById("editPopup");
    if(popup) popup.style.display = "none";
}

function savePartner(){
    const partnerId = document.getElementById("editPartnerId").value;
    const name = document.getElementById("editName").value;
    const wallet = document.getElementById("editWallet").value;

    fetch(WEB_APP_URL,{
        method:"POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body:JSON.stringify({
            action:"updatePartner",
            partnerId:partnerId,
            name:name,
            wallet:wallet
        })
    })
    .then(res=>res.json())
    .then(data=>{
        if(data && data.success){
            alert("Partner Updated Successfully");
            closePopup();
            return fetch(WEB_APP_URL,{
                method:"POST",
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body:JSON.stringify({ action:"getAllPartners" })
            });
        } else {
            throw new Error('Update failed');
        }
    })
    .then(res=>res && res.json ? res.json() : null)
    .then(data=>{
        if(data && data.success){
            allPartners = data.partners || [];
            loadPartners(allPartners);
        }
    })
    .catch(err=>{
        console.error('Error updating partner:', err);
        alert('Update Failed');
    });
}

function searchPartner(){
    const keyword = (document.getElementById("searchBox")?.value || '').toLowerCase();
    if(!keyword) { loadPartners(allPartners); return; }

    const filtered = allPartners.filter(partner =>
        (partner.partnerId || '').toLowerCase().includes(keyword) ||
        (partner.name || '').toLowerCase().includes(keyword)
    );

    loadPartners(filtered);
}

function toggleStatus(partnerId,status){
    if(!partnerId) return;

    fetch(WEB_APP_URL,{
        method:"POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body:JSON.stringify({ action:"toggleStatus", partnerId:partnerId })
    })
    .then(res=>res.json())
    .then(data=>{
        if(data && data.success){
            return fetch(WEB_APP_URL,{
                method:"POST",
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body:JSON.stringify({ action:"getAllPartners" })
            });
        } else {
            throw new Error('Toggle failed');
        }
    })
    .then(res=>res && res.json ? res.json() : null)
    .then(data=>{
        if(data && data.success){
            allPartners = data.partners || [];
            loadPartners(allPartners);
        }
    })
    .catch(err=>{
        console.error('Error toggling status:', err);
        alert('Operation failed');
    });
}
