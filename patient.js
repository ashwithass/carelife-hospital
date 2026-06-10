const { jsPDF } = window.jspdf;

const content = document.getElementById("content");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

const pid = localStorage.getItem("currentUser");

let APPS = [];
let chatInterval = null;

const APP_KEY = "patient_apps_" + pid;

APPS = JSON.parse(localStorage.getItem(APP_KEY)) || [];

Promise.all([
    fetch("http://localhost:5000/api/appointments").then(r=>r.json()).catch(()=>[])
]).then(([apps])=>{
    const filteredApps = apps.filter(a => a.pid === pid);
    if(filteredApps.length){
        APPS = filteredApps;
        localStorage.setItem(APP_KEY, JSON.stringify(APPS));
    }
    patientView();
});

/* ================= RENDER HISTORY ================= */
function patientView(){
    content.innerHTML =
        "<h2 style='text-align:center;color:#1976d2'>My Appointment History</h2>";

    if(!APPS.length){
        content.innerHTML += "<p style='text-align:center'>No history found.</p>";
        return;
    }

    APPS.forEach(a=>{
        content.innerHTML += `
        <div class="card">
            <p><b>Issue:</b> ${a.issue}</p>
            <p><b>Date:</b> ${a.date} ${a.time}</p>
            <p><b>Mode:</b> ${a.mode}</p>

            <div class="btn-group">
                <button class="nav-btn" onclick="viewPres('${a._id}')">View Prescription</button>
                <button class="nav-btn" onclick="visitPharmacy()">Visit Pharmacy</button>
                <button class="nav-btn" onclick="downloadPDF('${a._id}')">Download PDF</button>
                <button class="nav-btn" onclick="openChat('${a._id}')">Chat</button>
            </div>
        </div>`;
    });
}

/* ================= PRESCRIPTION POPUP ================= */
function viewPres(id){
    fetch(`http://localhost:5000/api/prescription/${id}`)
    .then(r=>r.json())
    .then(p=>{
        let html = `<h3 style="color:#1976d2">Prescription</h3>`;

        if(!p){
            html += "<p>No prescription available.</p>";
        }else{
            html += `
            <div class="pres-item">
                <p><b>Medicine:</b> ${p.medicine || "-"}</p>
                <p><b>Quantity:</b> ${p.qty || "-"}</p>
                <p><b>Price:</b> ₹${p.price || "0"}</p>
                <p><b>Tips:</b> ${p.tips || "-"}</p>
            </div>`;
        }

        html += `<button class="nav-btn" onclick="closeModal()">Close</button>`;

        modalContent.innerHTML = html;
        modal.style.display = "flex";
    });
}

function closeModal(){ modal.style.display="none"; }
function visitPharmacy(){ location.href = "pharmacy.html"; }

/* ================= PDF DOWNLOAD ================= */
function downloadPDF(appId){
    fetch(`http://localhost:5000/api/prescription/${appId}`)
    .then(r=>r.json())
    .then(p=>{
        if(!p){
            alert("No prescription available");
            return;
        }

        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();

        pdf.setFontSize(22);
        pdf.text("CareLife",20,20);

        pdf.setFontSize(12);
        pdf.text("Patient Name : " + pid, pageWidth - 80, 20);

        const app = APPS.find(a => a._id === appId);
        const appDate = app ? app.date : "-";

        pdf.text("Appointment Date : " + appDate,20,40);
        pdf.text("Medicine Name : " + (p.medicine || "-"),20,70);
        pdf.text("Quantity      : " + (p.qty || "-"),20,80);
        pdf.text("Price         : " + (p.price || "0"),20,90);
        pdf.text("Tips          : " + (p.tips || "-"),20,100);

        pdf.text("Doctor Signature", pageWidth - 60,270);

        pdf.save(pid + "_Prescription.pdf");
    });
}

/* ================= CHAT ================= */

function openChat(id){
    clearInterval(chatInterval);
    const box = document.getElementById("chatBox");
    box.style.display="flex";
    box.setAttribute("data-id",id);
    loadChat(id);
    chatInterval = setInterval(()=>loadChat(id),1000);
}

function closeChat(){
    document.getElementById("chatBox").style.display="none";
    clearInterval(chatInterval);
}

/* ✅ CORRECT REQUEST LOGIC */
function loadChat(id){
    fetch(`http://localhost:5000/api/chat/${id}`)
    .then(r=>r.json())
    .then(chats=>{
        const box=document.getElementById("chatMessages");
        box.innerHTML="";

        let lastRequestIndex = -1;

        chats.forEach((c,index)=>{
            const div=document.createElement("div");
            div.className = c.sender==="doc"?"doc":"pat";
            div.innerText = c.message;
            box.appendChild(div);

            if(
                c.sender==="doc" &&
                (
                    c.message.toLowerCase().includes("offline visit") ||
                    c.message.toLowerCase().includes("online visit")
                )
            ){
                lastRequestIndex = index;
            }
        });

        let patientReplied = false;

        if(lastRequestIndex !== -1){
            for(let i = lastRequestIndex + 1; i < chats.length; i++){
                if(
                    chats[i].sender === "pat" &&
                    (
                        chats[i].message.toLowerCase().includes("accepted") ||
                        chats[i].message.toLowerCase().includes("rejected")
                    )
                ){
                    patientReplied = true;
                    break;
                }
            }
        }

        if(lastRequestIndex !== -1 && !patientReplied){
            const req=document.createElement("div");
            req.className="req-box";
            req.innerHTML=`
                <button onclick="replyReq('Accepted')">Accept</button>
                <button onclick="replyReq('Rejected')">Reject</button>
            `;
            box.appendChild(req);
        }

        box.scrollTop = box.scrollHeight;
    });
}

function sendReply(){
    const input=document.getElementById("chatInput");
    const id=document.getElementById("chatBox").getAttribute("data-id");

    fetch("http://localhost:5000/api/chat",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
            appointmentId:id,
            sender:"pat",
            message:"Patient: "+input.value
        })
    }).then(()=>{
        input.value="";
        loadChat(id);
    });
}

function replyReq(status){
    const id=document.getElementById("chatBox").getAttribute("data-id");

    fetch("http://localhost:5000/api/chat",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
            appointmentId:id,
            sender:"pat",
            message:"Patient: "+status+" for offline visit"
        })
    }).then(()=>loadChat(id));
}

function logout(){
    localStorage.clear();
    location.href="index.html";
}
