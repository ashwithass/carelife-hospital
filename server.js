const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= MONGODB ================= */
mongoose.connect("mongodb+srv://ssashwithasoundarraj_db_user:A96hRf0aBPIexpwe@cluster0.qo27ybq.mongodb.net/smart_hospital?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>console.log("✅ MongoDB Connected"))
.catch(err=>console.log(err));

/* ================= SCHEMAS ================= */

// USERS
const User = mongoose.model("users", {
    pid: String,
    name: String,
    email: String,
    phone:String,
    password: String,
    role: { type:String, default:"patient" }
});

// APPOINTMENTS
const Appointment = mongoose.model("appointments", {
    pid: String,
    name: String,
    age: String,
    issue: String,
    description: String,
    mode: String,
    date: String,
    time: String,
    phone: String,
    email: String,
    done: { type:Boolean, default:false }
});

// PRESCRIPTIONS
const Prescription = mongoose.model("prescriptions", {
    pid: String,
    appointmentId: String,
    medicine: String,
    qty: String,
    price: String,
    tips: String,
    date: String,
    used: { type:Boolean, default:false }
});

// ORDERS
const Order = mongoose.model("orders", {
    pid: String,
    items: Array,
    address: String,
    payment: String,
    status: String,
    date: String
});

// CHAT
const Chat = mongoose.model("chats", {
    appointmentId: String,
    sender: String,
    message: String,
    time: { type: Date, default: Date.now }
});

/* ================= AUTH ================= */

app.post("/api/signup", async (req,res)=>{
    await User.create(req.body);
    res.json({ success:true });
});

app.post("/api/login", async (req,res)=>{
    const user = await User.findOne({
        pid: req.body.pid,
        password: req.body.password
    });

    if(!user){
        return res.status(401).json({ success:false });
    }

    res.json({
        success:true,
        pid: user.pid,
        role: user.role
    });
});

/* ================= APPOINTMENTS ================= */

app.post("/api/appointment", async (req,res)=>{
    try{
        const { date, time } = req.body;
        const normalizedTime = time.replace(/^0/, "");

        const exists = await Appointment.findOne({
            date: date,
            time: new RegExp(`^0?${normalizedTime}$`, "i")
        });

        if(exists){
            return res.json({ success:false, message:"SLOT_BOOKED" });
        }

        await Appointment.create(req.body);
        res.json({ success:true, message:"BOOKED" });

    }catch(err){
        res.json({ success:false, message:"ERROR" });
    }
});

app.get("/api/appointments", async (req,res)=>{
    try{
        const appointments = await Appointment.find().sort({ _id:-1 });

        const enriched = await Promise.all(
            appointments.map(async (a)=>{
                const user = await User.findOne({ pid: a.pid });

                return {
                    ...a._doc,
                    email: user?.email || a.email || "N/A",
                    phone: a.phone || "N/A"
                };
            })
        );

        res.json(enriched);
    }catch(err){
        res.status(500).json(err);
    }
});

/* TOGGLE DONE */
app.put("/api/appointment/:id", async (req,res)=>{
    const appt = await Appointment.findById(req.params.id);
    appt.done = !appt.done;
    await appt.save();
    res.json({ success:true, done: appt.done });
});

app.delete("/api/clear-history", async (req,res)=>{
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});
    await Chat.deleteMany({});
    res.json({ success:true });
});

/* ================= PRESCRIPTIONS ================= */

app.post("/api/prescription", async (req,res)=>{
    const { pid, appointmentId, medicine, qty, price, tips, date } = req.body;

    let existing = await Prescription.findOne({ appointmentId });

    if(existing){
        existing.medicine = medicine;
        existing.qty = qty;
        existing.price = price;
        existing.tips = tips;
        existing.date = date;
        await existing.save();
    } else {
        await Prescription.create({
            pid,
            appointmentId,
            medicine,
            qty,
            price,
            tips,
            date
        });
    }

    res.json({ success:true });
});

app.get("/api/prescription/:id", async (req,res)=>{
    const data = await Prescription.findOne({
        appointmentId: req.params.id
    });
    res.json(data || null);
});

/* ================= PHARMACY ================= */

app.get("/api/prescriptions", async (req,res)=>{
    const data = await Prescription.find({ used:false });
    res.json(data);
});

app.put("/api/prescriptions/use", async (req,res)=>{
    const { ids } = req.body;

    await Prescription.updateMany(
        { _id: { $in: ids } },
        { $set: { used:true } }
    );

    res.json({ success:true });
});

/* ================= ORDERS ================= */

app.post("/api/order", async (req,res)=>{
    await Order.create(req.body);
    res.json({ success:true });
});

app.get("/api/orders/:pid", async (req,res)=>{
    const data = await Order.find({ pid:req.params.pid })
                            .sort({ _id:-1 });
    res.json(data);
});

/* ================= CHAT APIs ================= */

app.post("/api/chat", async (req,res)=>{
    await Chat.create(req.body);
    res.json({ success:true });
});

app.get("/api/chat/:id", async (req,res)=>{
    const data = await Chat.find({ appointmentId:req.params.id })
                           .sort({ time:1 });
    res.json(data);
});

/* ================= ✅ ADMIN APIs (FIX) ================= */

// All patients
app.get("/api/admin/users", async (req, res) => {
    try {
        const users = await User.find({ role: "patient" });
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// All pharmacy orders
app.get("/api/admin/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ _id: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

/* =========================================================
   ⭐⭐⭐ POWER BI WEB REPORT APIs ⭐⭐⭐
   Clean tabular data for Power BI (no Record/List issues)
   ========================================================= */

// REPORT — Users (patients)
app.get("/api/report/users", async (req,res)=>{
    try{
        const data = await User.find({ role:"patient" }).lean();
        res.json(data);
    }catch(err){
        res.status(500).json(err);
    }
});

// REPORT — Appointments with patient email
app.get("/api/report/appointments", async (req,res)=>{
    try{
        const appointments = await Appointment.find().lean();

        const enriched = await Promise.all(
            appointments.map(async (a)=>{
                const user = await User.findOne({ pid: a.pid }).lean();
                return {
                    ...a,
                    email: user?.email || a.email || "N/A"
                };
            })
        );

        res.json(enriched);
    }catch(err){
        res.status(500).json(err);
    }
});

// REPORT — Prescriptions with patient name
app.get("/api/report/prescriptions", async (req,res)=>{
    try{
        const data = await Prescription.aggregate([
            { $match: { used:false } },
            {
                $lookup: {
                    from: "users",
                    localField: "pid",
                    foreignField: "pid",
                    as: "patient"
                }
            },
            { $unwind: "$patient" },
            {
                $project: {
                    _id: 0,
                    pid: 1,
                    patientName: "$patient.name",
                    medicine: 1,
                    qty: 1,
                    price: 1,
                    date: 1
                }
            }
        ]);

        res.json(data);
    }catch(err){
        res.status(500).json(err);
    }
});

// REPORT — Orders with patient name and items count
app.get("/api/report/orders", async (req,res)=>{
    try{
        const data = await Order.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "pid",
                    foreignField: "pid",
                    as: "patient"
                }
            },
            { $unwind: "$patient" },
            {
                $project: {
                    _id: 0,
                    pid: 1,
                    patientName: "$patient.name",
                    address: 1,
                    payment: 1,
                    status: 1,
                    date: 1,
                    itemsCount: { $size: "$items" }
                }
            }
        ]);

        res.json(data);
    }catch(err){
        res.status(500).json(err);
    }
});

// REPORT — Chats
app.get("/api/report/chats", async (req,res)=>{
    try{
        const data = await Chat.find().lean();
        res.json(data);
    }catch(err){
        res.status(500).json(err);
    }
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
/* ================= SERVER ================= */

app.listen(5000, ()=>{
    console.log("🚀 Server running at http://localhost:5000");
});
