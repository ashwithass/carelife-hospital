/* ---------- NAV LOGIC ---------- */

function goLogin(){
    window.location.href = "login.html";
}

function goAppointment(){
    const role = localStorage.getItem("role");

    if(!role){
        window.location.href = "appointment.html?mode=offline";
        return;
    }

    if(role === "patient"){
        window.location.href = "appointment.html";
    }
}

function goPharmacy(){

    const role = localStorage.getItem("role");

    if(role !== "patient"){
        alert("Only patients can access pharmacy");
        return;
    }

    window.location.href = "pharmacy.html";
}


/* ✅ FIXED HISTORY NAVIGATION */

function goHistory(){

    const role = localStorage.getItem("role");

    if(role === "doctor"){
        window.location.href = "doctor.html";
    }
    else if(role === "patient"){
        window.location.href = "patient.html";
    }
    else{
        window.location.href = "history.html";
    }

}



/* ---------- LOGIN BUTTON ---------- */

const loginBtn = document.getElementById("loginBtn");
const logoutBox = document.getElementById("logoutBox");

function updateLoginButton(){

    const role = localStorage.getItem("role");

    if(!role){
        loginBtn.innerText = "Login / Signup";
        return;
    }

    if(role === "doctor"){
        loginBtn.innerText = "Doctor";
    }

    if(role === "patient"){

        const pid = localStorage.getItem("currentUser");
        const patients = JSON.parse(localStorage.getItem("patients")) || {};

        loginBtn.innerText =
            patients[pid]?.name || pid || "Patient";
    }
}


function handleLoginClick(){

    if(!localStorage.getItem("role")){
        goLogin();
    }
    else{

        logoutBox.style.display =
            logoutBox.style.display === "block"
            ? "none"
            : "block";
    }

}


/* ---------- LOGOUT ---------- */

function logoutUser(){

    localStorage.removeItem("role");
    localStorage.removeItem("currentUser");

    logoutBox.style.display = "none";

    updateLoginButton();

}



/* ---------- CHATBOT LOGIC ---------- */

const diseases = [

"Common Cold",
"Headache",
"Mild Fever",
"Stomach Upset",
"Diarrhea",
"Allergy",
"Body Pain",
"Mouth Ulcer",
"Cough",
"Minor Wound"

];


const treatment = {

"Common Cold":{
u18:"Paracetamol syrup",
a18:"Paracetamol + Cetirizine",
care:"Steam, warm fluids"
},

"Headache":{
u18:"Paracetamol",
a18:"Paracetamol / Ibuprofen",
care:"Rest, hydration"
},

"Mild Fever":{
u18:"Paracetamol syrup",
a18:"Paracetamol",
care:"Fluids, rest"
},

"Stomach Upset":{
u18:"ORS",
a18:"Antacid syrup",
care:"Light food"
},

"Diarrhea":{
u18:"ORS + Zinc",
a18:"ORS + Probiotics",
care:"Coconut water"
},

"Allergy":{
u18:"Cetirizine syrup",
a18:"Cetirizine tablet",
care:"Avoid dust"
},

"Body Pain":{
u18:"Paracetamol",
a18:"Ibuprofen",
care:"Warm compress"
},

"Mouth Ulcer":{
u18:"Vitamin B syrup",
a18:"Vitamin B tablet",
care:"Salt gargle"
},

"Cough":{
u18:"Cough syrup",
a18:"Cough syrup",
care:"Steam inhalation"
},

"Minor Wound":{
u18:"Antiseptic cream",
a18:"Antiseptic cream",
care:"Keep clean & dry"
}

};


let step = 0;
let selectedDisease = "";
let userAge = 0;
let issueDays = 0;


/* ---------- CHAT UI ---------- */

function toggleChat(){

    document.getElementById("chatbot").classList.toggle("show");

    if(step === 0){
        showOptions();
    }

}


function addMsg(text,type){

    const chatBody = document.getElementById("chatBody");

    const div = document.createElement("div");

    div.className = type === "user"
        ? "user-msg"
        : "bot-msg";


    if(type === "user"){

        const pid = localStorage.getItem("currentUser");
        const patients = JSON.parse(localStorage.getItem("patients")) || {};
        const name = patients[pid]?.name || "U";

        div.setAttribute("data-user", name.charAt(0).toUpperCase());

    }

    div.innerHTML = text;

    chatBody.appendChild(div);

    chatBody.scrollTop = 9999;

}



/* ---------- DISEASE OPTIONS ---------- */

function showOptions(){

let html = `<div class="option-box">`;

diseases.forEach((d,i)=>{
html += `<button onclick="selectDisease(${i})">${d}</button>`;
});

html += `<button onclick="selectDisease(99)">Others</button></div>`;

addMsg(html,"bot");

}



/* ---------- DISEASE SELECT ---------- */

function selectDisease(i){

if(i === 99){

addMsg("Please type your disease:","bot");
step = 99;
return;

}

selectedDisease = diseases[i];

addMsg("Enter your age:","bot");

step = 2;

}



/* ---------- MESSAGE SEND ---------- */

function sendMessage(){

const input = document.getElementById("chatInput");
const text = input.value.trim();

if(!text) return;

addMsg(text,"user");

input.value = "";


/* AGE */

if(step === 2){

userAge = parseInt(text);

addMsg("How many days you face this issue?","bot");

step = 3;

}


/* ISSUE DAYS */

else if(step === 3){

issueDays = parseInt(text);

addMsg(`

Is it serious or normal?

<div class="option-box">

<button onclick="selectSeverity('normal')">Normal</button>

<button onclick="selectSeverity('serious')">Serious</button>

</div>

`,"bot");

step = 4;

}


/* OTHER DISEASE */

else if(step === 99){

addMsg(`

<b>Noted:</b> ${text}<br>

⚠ For accurate treatment, please consult a doctor.

<div class="action-buttons">

<button class="book-btn" onclick="goAppointment()">Book Appointment</button>

<button class="exit-btn" onclick="addMsg('Thank you 😊','bot')">Exit</button>

</div>

`,"bot");

step = 0;

}

}



/* ---------- SEVERITY ---------- */

function selectSeverity(type){

if(type === "serious"){

addMsg(`

⚠ <b>Condition marked as serious</b><br>

Please consult a doctor immediately.

<div class="action-buttons">

<button class="book-btn" onclick="goAppointment()">Book Appointment</button>

<button class="exit-btn" onclick="addMsg('Thank you 😊','bot')">Exit</button>

</div>

`,"bot");

step = 0;

return;

}

showTreatment();

}



/* ---------- SHOW TREATMENT ---------- */

function showTreatment(){

const t = treatment[selectedDisease];

const med = userAge < 18 ? t.u18 : t.a18;

const warn = issueDays > 3
? "<br>⚠ Symptoms for more than 3 days. Please check doctor."
: "";

addMsg(`

<b>${selectedDisease}</b><br>

💊 ${med}<br>

🏠 ${t.care}${warn}

<div class="action-buttons">

<button class="book-btn" onclick="goAppointment()">Book Appointment</button>

<button class="exit-btn" onclick="addMsg('Thank you 😊','bot')">Exit</button>

</div>

`,"bot");

step = 0;

}



/* ---------- UPDATE LOGIN BUTTON ---------- */

window.addEventListener("storage", updateLoginButton);

updateLoginButton();