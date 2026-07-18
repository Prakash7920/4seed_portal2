window.addEventListener("scroll", function () {

    const nav = document.querySelector(".navbar");

    if (window.scrollY > 80) {

        nav.style.background = "#0B7A3D";
        nav.style.boxShadow = "0 5px 20px rgba(0,0,0,.25)";

    } else {

        nav.style.background = "rgba(11,122,61,.95)";
        nav.style.boxShadow = "none";

    }

});
function animateValue(id,end,speed){

let current=0;

const obj=document.getElementById(id);

const timer=setInterval(()=>{

current++;

obj.innerHTML=current+"+";

if(current>=end){

clearInterval(timer);

}

},speed);

}

animateValue("partnerCount",500,5);

animateValue("cityCount",25,40);

animateValue("teamCount",150,15);
const menuToggle=document.getElementById("menuToggle");

const navLinks=document.querySelector(".nav-links");

menuToggle.addEventListener("click",()=>{

navLinks.classList.toggle("active");

});
const reveals=document.querySelectorAll(".reveal");

window.addEventListener("scroll",revealSections);

function revealSections(){

reveals.forEach(section=>{

const top=section.getBoundingClientRect().top;

const windowHeight=window.innerHeight;

if(top<windowHeight-120){

section.classList.add("active");

}

});

}

revealSections();
