const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  selectedSymptoms: [String],
  otherSymptoms: String,
  duration: String,
  severity: String,
  date: { type: Date, default: Date.now },
  aiAssessment: String, // <- Add this line
});

module.exports = mongoose.model("SymptomAssessment", symptomSchema);
