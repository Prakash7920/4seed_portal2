const partner =
JSON.parse(localStorage.getItem("partner"));

if(!partner){

window.location="login.html";

}

document.getElementById("idName")
.innerHTML=partner.name;

document.getElementById("idPartner")
.innerHTML=partner.partnerId;

document.getElementById("idSponsor")
.innerHTML=partner.sponsorName;
