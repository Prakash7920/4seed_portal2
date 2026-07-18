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

    // Ensure the target step element exists before proceeding
    const target = document.getElementById("step"+step);
    if(!target){
        // Nothing to show on this page
        return;
    }

    currentStep = step;

    // Hide all (only if elements exist)
    if(step1 && step1.classList) step1.classList.remove("active");
    if(step2 && step2.classList) step2.classList.remove("active");
    if(step3 && step3.classList) step3.classList.remove("active");

    if(successPage && successPage.classList) {
        successPage.classList.remove("active");
    }

    // Remove active from indicators
    if(stepItems && stepItems.forEach){
        stepItems.forEach(item=> item.classList.remove("active"));
    }

    // Show selected
    target.classList.add("active");

    // Highlight completed/current (guard against shorter stepItems list)
    for(let i=0;i<step && i<stepItems.length;i++){
        if(stepItems[i] && stepItems[i].classList) stepItems[i].classList.add("active");
    }

    updateProgress();

}

// ---------- Progress ----------
function updateProgress(){

    // Only update if progress elements are present
    if(!progressFill || !progressText || !stepText) return;

    const percent = [33,66,100];

    // Guard index range
    const idx = Math.max(0, Math.min(percent.length-1, currentStep-1));

    progressFill.style.width = percent[idx]+"%";

    progressText.innerHTML = percent[idx]+"%";

    stepText.innerHTML = "Step "+currentStep+" of 3";

}

// ---------- Navigation ----------
const prevStep2Btn = document.getElementById("prevStep2");
if(prevStep2Btn) {
    prevStep2Btn.addEventListener("click",()=>{
        showStep(1);
    });
}

const prevStep3Btn = document.getElementById("prevStep3");
if(prevStep3Btn) {
    prevStep3Btn.addEventListener("click",()=>{
        showStep(2);
    });
}

// ---------- Initial ----------
// Only show step if the step element exists on the page
if(document.getElementById("step1")){
    showStep(1);
}

// =====================================
// Part 2 : Sponsor Verification
// =====================================

// Form Elements
const sponsorId = document.getElementById("sponsorId");
const sponsorName = document.getElementById("sponsorName");
const status = document.getElementById("status");

const verifyBtn = document.getElementById("verifySponsorBtn");
const nextStep1 = document.getElementById("nextStep1");

// Disable Next initially (only if present)
if(nextStep1) nextStep1.disabled = true;

// Verify Sponsor
if(verifyBtn){
    verifyBtn.addEventListener("click", async ()=>{

        const id = sponsorId ? sponsorId.value.trim() : "";

        if(id===""){

            alert("Please enter Sponsor ID");

            if(sponsorId) sponsorId.focus();

            return;

        }

        verifyBtn.disabled = true;
        verifyBtn.innerHTML = "Verifying...";

        if(status) status.innerHTML = "";
        if(sponsorName) sponsorName.value = "";

        try{

            // Expect verifySponsor to be defined elsewhere (API call)
            const result = await verifySponsor(id);

            if(result && result.status){

                if(sponsorName) sponsorName.value = result.sponsorName || "";

                if(status){
                    status.innerHTML = "✅ Sponsor Verified";
                    status.style.color = "green";
                }

                if(nextStep1) nextStep1.disabled = false;

                if(sponsorId) sponsorId.readOnly = true;

                verifyBtn.innerHTML = "✅ Verified";
                verifyBtn.style.background = "#28a745";
                verifyBtn.style.color = "#ffffff";
                verifyBtn.disabled = true;

            }else{

                if(status){
                    status.innerHTML = "❌ Invalid Sponsor ID";
                    status.style.color = "red";
                }

                verifyBtn.disabled = false;

                verifyBtn.innerHTML = "Verify Sponsor";

            }

        }catch(err){

            console.error(err);

            if(status){
                status.innerHTML = "❌ Server Error";
                status.style.color = "red";
            }

            verifyBtn.disabled = false;

            verifyBtn.innerHTML = "Verify Sponsor";

        }

    });
}

// Next Button
if(nextStep1){
    nextStep1.addEventListener("click",()=>{
        showStep(2);
    });
}

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
if(nextStep2){
    nextStep2.addEventListener("click",()=>{

        // Full Name
        if(!fullName || fullName.value.trim()===""){

            alert("Please enter Full Name");

            if(fullName) fullName.focus();

            return;

        }

        // Mobile
        if(!mobile || !/^[0-9]{10}$/.test(mobile.value.trim())){

            alert("Please enter a valid 10-digit Mobile Number");

            if(mobile) mobile.focus();

            return;

        }
        
        if(!password || password.value !== (confirmPassword ? confirmPassword.value : "")){

            alert("Password and Confirm Password do not match");

            if(password) password.focus();

            return;

        }
        
        // Place
        if(!place || place.value.trim()===""){

            alert("Please enter Place");

            if(place) place.focus();

            return;

        }

        // Review Screen (only set review fields if they exist)
        if(reviewSponsorId) reviewSponsorId.textContent = sponsorId ? sponsorId.value : "";
        if(reviewSponsorName) reviewSponsorName.textContent = sponsorName ? sponsorName.value : "";
        if(reviewFullName) reviewFullName.textContent = fullName ? fullName.value : "";
        if(reviewMobile) reviewMobile.textContent = mobile ? mobile.value : "";
        if(reviewEmail) reviewEmail.textContent = (email && email.value.trim()!=="") ? email.value : "Not Provided";
        if(reviewPlace) reviewPlace.textContent = place ? place.value : "";

        showStep(3);

    });
}
// =====================================
// Part 4 : Registration Submit
// =====================================

const registerBtn = document.getElementById("registerBtn");
const agree = document.getElementById("agree");

if(registerBtn){
    registerBtn.addEventListener("click", async () => {

        // Terms Check
        if(agree && !agree.checked){

            alert("Please accept the Terms & Conditions");

            return;

        }

        registerBtn.disabled = true;
        registerBtn.innerHTML = "Registering...";

        try{

            // Expect registerPartner to be defined elsewhere
            const result = await registerPartner({
                sponsorId: sponsorId ? sponsorId.value.trim() : "",
                sponsorName: sponsorName ? sponsorName.value.trim() : "",
                fullName: fullName ? fullName.value.trim() : "",
                mobile: mobile ? mobile.value.trim() : "",
                email: email ? email.value.trim() : "",
                place: place ? place.value.trim() : "",
                password: password ? password.value : ""
            });

            if(result && result.success){

                const partnerEl = document.getElementById("partnerIdText");
                if(partnerEl) partnerEl.innerHTML = result.partnerId;

                showSuccess(result.partnerId);

            }else{

                alert(result ? (result.message || "Registration Failed") : "Registration Failed");

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
}
// =====================================
// Success Screen
// =====================================

function showSuccess(partnerId){

    const partnerEl = document.getElementById("partnerIdText");
    if(partnerEl) partnerEl.textContent = partnerId;

    if(step1 && step1.classList) step1.classList.remove("active");
    if(step2 && step2.classList) step2.classList.remove("active");
    if(step3 && step3.classList) step3.classList.remove("active");

    if(successPage && successPage.classList) successPage.classList.add("active");

    // Redirect to login if present
    setTimeout(()=>{
        window.location.href = "login.html";
    },3000);

}
