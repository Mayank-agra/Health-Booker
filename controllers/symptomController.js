// symptomController.js

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this is in your .env file
});

const SymptomAssessment = require("../models/symptomModel");

const assessSymptoms = async (req, res) => {
  try {
    const { selectedSymptoms, otherSymptoms, duration, severity } = req.body;

    const symptomsText = `
      Symptoms: ${selectedSymptoms.join(", ")}
      Other Symptoms: ${otherSymptoms}
      Duration: ${duration}
      Severity: ${severity}
    `;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a medical assistant helping assess symptoms." },
        { role: "user", content: `Here are my symptoms:\n${symptomsText}\nPlease provide a possible assessment.` },
      ],
    });

    const aiAssessment = chatResponse.choices[0].message.content;

    const newEntry = new SymptomAssessment({
      userId: req.locals,
      selectedSymptoms,
      otherSymptoms,
      duration,
      severity,
      date: new Date(),
      aiAssessment, // make sure to add this field in your schema
    });

    await newEntry.save();

    return res.status(201).json({ message: "Assessment saved", aiAssessment });
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to assess symptoms");
  }
};

module.exports = { assessSymptoms };
