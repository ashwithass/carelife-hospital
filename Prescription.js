const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  pid: {
    type: String,
    required: true
  },
  appointmentId: {
    type: String,
    required: true,
    unique: true
  },
  medicine: {
    type: String,
    default: ""
  },
  qty: {
    type: String,
    default: ""
  },
  tips: {
    type: String,
    default: ""
  },
  date: {
    type: String
  }
});

module.exports = mongoose.model("prescriptions", PrescriptionSchema);
