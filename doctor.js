const { jsPDF } = window.jspdf;

const content = document.getElementById("content");
const modal = document.getElementById("modal");
const details = document.getElementById("details");
const med = document.getElementById("med");
const qty = document.getElementById("qty");
const price = document.getElementById("price");
const tips = document.getElementById("tips");
const tipsToggle = document.getElementById("tipsToggle");
const saveBtn = document.getElementById("saveBtn");
const prescriptionSection = document.getElementById("prescriptionSection");
const issueTextSpan = document.getElementById("issueText");

let APPS = [];
let CURRENT = null;
let medicinePrice = 0;

/* ================= LOAD APPOINTMENTS ================= */

fetch("http://localhost:5000/api/appointments")
.then(r => r.json())
.then(data => {
APPS = data;
doctorView();
})
.catch(err => console.log("Error loading appointments", err));

/* ================= SHOW APPOINTMENTS ================= */

function doctorView(){

content.innerHTML =
"<h2 style='text-align:center;color:#1976d2'>Doctor Appointments</h2>";

APPS.forEach(a => {

content.innerHTML += `

<div class="card ${a.done ? 'done' : ''}" id="card-${a._id}">

<p><b>Patient ID:</b> ${a.pid || "N/A"}</p>
<p><b>Issue:</b> ${a.issue}</p>
<p><b>Date:</b> ${a.date} ${a.time}</p>

<p style="margin:8px 0;">
<b>Contact details:</b> ${a.email || ""}, ${a.phone || ""}
</p>

<p><b>Mode:</b> ${a.mode || "Offline"}</p>

<div class="btn-row">

<button class="nav-btn viewBtn" data-id="${a._id}">
View Appointment
</button>

<button class="nav-btn outline doneBtn" data-id="${a._id}">
${a.done ? "Done" : "Mark as Done"}
</button>

</div>
</div>
`;

});

/* attach button events */

document.querySelectorAll(".viewBtn").forEach(btn=>{
btn.onclick=()=>openModal(btn.dataset.id);
});

document.querySelectorAll(".doneBtn").forEach(btn=>{
btn.onclick=()=>toggleDone(btn.dataset.id,btn);
});

}

/* ================= MARK DONE ================= */

function toggleDone(id,btn){

fetch(`http://localhost:5000/api/appointment/${id}`,{
method:"PUT"
})
.then(res=>res.json())
.then(data=>{

const card=document.getElementById("card-"+id);

if(data.done){
card.classList.add("done");
btn.innerText="Done";
}
else{
card.classList.remove("done");
btn.innerText="Mark as Done";
}

});

}

/* ================= OPEN MODAL ================= */

function openModal(id){

CURRENT = APPS.find(x => x._id === id);

if(!CURRENT){
alert("Appointment not found");
return;
}

medicinePrice = 0;
price.value = "";
document.getElementById("autoMedicineList").innerHTML="";

details.innerHTML = `

<p><b>Name:</b> ${CURRENT.name}</p>
<p><b>Age:</b> ${CURRENT.age}</p>
<p><b>Issue:</b> ${CURRENT.issue}</p>
<p><b>Description:</b> ${CURRENT.description}</p>
<p><b>Date:</b> ${CURRENT.date}</p>
<p><b>Time:</b> ${CURRENT.time}</p>
<p><b>Mode:</b> ${CURRENT.mode || "Offline"}</p>
`;

issueTextSpan.innerText = CURRENT.issue;

/* detect disease */

const detected = detectDisease(CURRENT.issue);
if(detected){
loadMedicinesForDisease(detected);
}

/* medicine selection */

document.getElementById("autoMedicineList").onclick = function(e){

const item = e.target.closest(".auto-item");
if(!item) return;

const text = item.innerText;
const match = text.match(/₹(\d+)/);

if(match){
medicinePrice = parseInt(match[1]);
calculatePrice();
}

};

/* days selection */

const days = document.getElementById("days");
if(days){
days.onchange = calculatePrice;
}

/* ================= ONLINE / OFFLINE CONTROL ================= */

const mode = (CURRENT.mode || "").trim().toLowerCase();

if(mode === "offline" || mode === ""){

prescriptionSection.style.display = "none";
saveBtn.style.display = "none";

}else{

prescriptionSection.style.display = "block";
saveBtn.style.display = "inline-block";

}

/* ================= LOAD SAVED PRESCRIPTION ================= */

fetch(`http://localhost:5000/api/prescription/${id}`)
.then(r=>r.json())
.then(saved=>{

med.value = saved?.medicine || "";
qty.value = saved?.qty || "";
price.value = saved?.price ? "₹ "+saved.price : "";
tips.value = saved?.tips || "";

});

tipsToggle.checked = false;
toggleTipsOnly();

/* OPEN MODAL */

modal.classList.add("show");

}

/* ================= PRICE CALCULATION ================= */

function calculatePrice(){

const days = document.getElementById("days")?.value;

if(!days || !medicinePrice) return;

const total = medicinePrice * parseInt(days);

price.value = "₹ " + total;

}

/* ================= SAVE PRESCRIPTION ================= */

function savePrescription(){

if(!med.value && !qty.value && !tips.value){
alert("Prescription cannot be empty");
return;
}

const numericPrice = price.value.replace("₹ ","");

const payload = {

pid: CURRENT.pid,
appointmentId: CURRENT._id,
medicine: med.value,
qty: qty.value,
price: numericPrice,
tips: tips.value,
date: new Date().toLocaleString()

};

fetch("http://localhost:5000/api/prescription",{

method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify(payload)

})
.then(()=> alert("Prescription Saved Permanently ✅"));

}

/* ================= DOWNLOAD PDF ================= */

function downloadDoctorPDF(){

const pdf = new jsPDF();
const total = parseInt(price.value.replace("₹ ","")) || 0;

pdf.setFontSize(22);
pdf.text("CareLife",20,20);

pdf.setFontSize(12);

pdf.text("Patient Name : "+CURRENT.name,20,40);
pdf.text("Medicine : "+med.value,20,70);
pdf.text("Dosage : "+qty.value,20,80);
pdf.text("Price : ₹ "+total,20,90);
pdf.text("Tips : "+tips.value,20,100);

pdf.save(CURRENT.name+"_Prescription.pdf");

}

/* ================= CLOSE MODAL ================= */

function closeModal(){
modal.classList.remove("show");
}

/* ================= TIPS ONLY ================= */

function toggleTipsOnly(){

const lock = tipsToggle.checked;

med.disabled = lock;
qty.disabled = lock;
price.disabled = lock;

}

/* ================= LOGOUT ================= */

function logout(){
localStorage.clear();
location.href="index.html";
}
