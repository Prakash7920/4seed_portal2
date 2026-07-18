// =====================================
// 4Seed Portal V3 - Register Module
// Part 1 : Wizard Navigation
// =====================================

// ---------- Current Step ----------
let currentStep = 1;

// ---------- Step Elements ----------
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const successPage = document.getElementById("successPage");

// ---------- Progress ----------
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const stepText = document.getElementById("stepText");

// ---------- Step Indicator ----------
const stepItems = document.querySelectorAll(".step");

// ---------- Show Step ----------
function showStep(step){

    currentStep = step;

    // Hide all
    step1.classList.remove("active");
    step2.classList.remove("active");
    step3.classList.remove("active");

    if(successPage){
        successPage.classList.remove("active");
    }

    // Remove active
    stepItems.forEach(item=>item.classList.remove("active"));

    // Show selected
    document.getElementById("step"+step).classList.add("active");

    // Highlight completed/current
    for(let i=0;i<step;i++){
        stepItems[i].classList.add("active");
    }

    updateProgress();

}

// ---------- Progress ----------
function updateProgress(){

    const percent = [33,66,100];

    progressFill.style.width = percent[currentStep-1]+"%";

    progressText.innerHTML =
    percent[currentStep-1]+"%";

    stepText.innerHTML =
    "Step "+currentStep+" of 3";

}

// ---------- Navigation ----------

document
.getElementById("prevStep2")
.addEventListener("click",()=>{

    showStep(1);

});

document
.getElementById("prevStep3")
.addEventListener("click",()=>{

    showStep(2);

});

// ---------- Initial ----------
showStep(1);

// =====================================
// Part 2 : Sponsor Verification
// =====================================

// Form Elements
const sponsorId = document.getElementById("sponsorId");
const sponsorName = document.getElementById("sponsorName");
const status = document.getElementById("status");

const verifyBtn = document.getElementById("verifySponsorBtn");
const nextStep1 = document.getElementById("nextStep1");

// Disable Next initially
nextStep1.disabled = true;

// Verify Sponsor
verifyBtn.addEventListener("click", async ()=>{

    const id = sponsorId.value.trim();

    if(id===""){

        alert("Please enter Sponsor ID");

        sponsorId.focus();

        return;

    }

    verifyBtn.disabled = true;
    verifyBtn.innerHTML = "Verifying...";

    status.innerHTML = "";
    sponsorName.value = "";

    try{

        const result = await verifySponsor(id);

        if(result.status){

    sponsorName.value = result.sponsorName;

    status.innerHTML = "✅ Sponsor Verified";

    status.style.color = "green";

    nextStep1.disabled = false;

    sponsorId.readOnly = true;

    verifyBtn.innerHTML = "✅ Verified";
    verifyBtn.style.background = "#28a745";
    verifyBtn.style.color = "#ffffff";
    verifyBtn.disabled = true;

        }else{

            status.innerHTML = "❌ Invalid Sponsor ID";

            status.style.color = "red";

            verifyBtn.disabled = false;

            verifyBtn.innerHTML = "Verify Sponsor";

        }

    }catch(err){

        console.error(err);

        status.innerHTML = "❌ Server Error";

        status.style.color = "red";

        verifyBtn.disabled = false;

        verifyBtn.innerHTML = "Verify Sponsor";

    }

});

// Next Button
nextStep1.addEventListener("click",()=>{

    showStep(2);

});

// =====================================
// Part 3 : Personal Details & Review
// =====================================

// Personal Details
const fullName = document.getElementById("fullName");
const mobile = document.getElementById("mobile");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const place = document.getElementById("place");

// Review Fields
const reviewSponsorId = document.getElementById("reviewSponsorId");
const reviewSponsorName = document.getElementById("reviewSponsorName");
const reviewFullName = document.getElementById("reviewFullName");
const reviewMobile = document.getElementById("reviewMobile");
const reviewEmail = document.getElementById("reviewEmail");
const reviewPlace = document.getElementById("reviewPlace");

const nextStep2 = document.getElementById("nextStep2");

// Next Button - Step 2
nextStep2.addEventListener("click",()=>{

    // Full Name
    if(fullName.value.trim()===""){

        alert("Please enter Full Name");

        fullName.focus();

        return;

    }

    // Mobile
    if(!/^[0-9]{10}$/.test(mobile.value.trim())){

        alert("Please enter a valid 10-digit Mobile Number");

        mobile.focus();

        return;

    }
    
    if(password.value !== confirmPassword.value){

    alert("Password and Confirm Password do not match");

    password.focus();

    return;

    }
    
    // Place
    if(place.value.trim()===""){

        alert("Please enter Place");

        place.focus();

        return;

    }

    // Review Screen
    reviewSponsorId.textContent = sponsorId.value;
    reviewSponsorName.textContent = sponsorName.value;
    reviewFullName.textContent = fullName.value;
    reviewMobile.textContent = mobile.value;
    reviewEmail.textContent =
        email.value.trim()==="" ? "Not Provided" : email.value;
    reviewPlace.textContent = place.value;

    showStep(3);

});
// =====================================
// Part 4 : Registration Submit
// =====================================

const registerBtn = document.getElementById("registerBtn");
const agree = document.getElementById("agree");

registerBtn.addEventListener("click", async () => {

    // Terms Check
    if(!agree.checked){

        alert("Please accept the Terms & Conditions");

        return;

    }

    registerBtn.disabled = true;
    registerBtn.innerHTML = "Registering...";

    try{

        const result = await registerPartner({

    sponsorId: sponsorId.value.trim(),

    sponsorName: sponsorName.value.trim(),

    fullName: fullName.value.trim(),

    mobile: mobile.value.trim(),

    email: email.value.trim(),

    place: place.value.trim(),

    password: password.value

});

        if(result.success){

            document.getElementById("partnerIdText").innerHTML =
            result.partnerId;

            showSuccess(result.partnerId);

        }else{

            alert(result.message || "Registration Failed");

            registerBtn.disabled = false;

            registerBtn.innerHTML = "Register";

        }

    }catch(err){

        console.error(err);

        alert("Server Error");

        registerBtn.disabled = false;

        registerBtn.innerHTML = "Register";

    }

});
// =====================================
// Success Screen
// =====================================

function showSuccess(partnerId){

    document.getElementById("partnerIdText").textContent = partnerId;

    step1.classList.remove("active");
    step2.classList.remove("active");
    step3.classList.remove("active");

    successPage.classList.add("active");

    setTimeout(()=>{
        window.location.href = "login.html";
    },3000);

}
