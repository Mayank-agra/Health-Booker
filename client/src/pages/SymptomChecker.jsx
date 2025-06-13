import React, { useState, useEffect } from "react";

const symptomsList = [
  "Fever", "Cough", "Fatigue", "Nausea", "Diarrhea", "Chest pain", "Rash",
  "Headache", "Sore throat", "Shortness of breath", "Vomiting", "Abdominal pain", "Dizziness"
];

const SymptomChecker = () => {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [otherSymptoms, setOtherSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");
  const [aiAssessment, setAiAssessment] = useState("");


  useEffect(() => {
    if (step === 3) {
      const submitAssessment = async () => {
        try {
          const token = localStorage.getItem("token");
      
          const payload = {
            symptoms: selectedSymptoms,
            otherSymptoms,
            duration,
            severity,
          };
      
          const response = await fetch("/api/symptom-assessment/assess", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
      
          const data = await response.json();
          setAiAssessment(data.assessment);
        } catch (error) {
          console.error("Failed to submit symptoms", error);
        }
      };
      
  
      submitAssessment();
    }
  }, [step]);

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setOtherSymptoms("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Symptom Checker</h1>

      <div className="bg-gray-100 p-4 rounded-lg text-sm">
        <strong>Disclaimer:</strong> This tool provides preliminary assessments only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
      </div>

      <div className="flex gap-6">
        {["Symptoms", "Details", "Assessment"].map((label, index) => (
          <div
            key={label}
            className={`flex-1 text-center border-b-4 pb-1 ${
              step === index + 1 ? "border-black font-semibold" : "border-gray-300"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 1: Select Your Symptoms</h2>
          <div className="grid grid-cols-2 gap-4">
            {symptomsList.map((symptom) => (
              <label key={symptom} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleSymptomToggle(symptom)}
                />
                {symptom}
              </label>
            ))}
          </div>
          <div className="mt-4">
            <label className="block font-medium">Other symptoms not listed above:</label>
            <textarea
              className="w-full border mt-1 p-2 rounded"
              rows="2"
              placeholder="Describe any other symptoms you're experiencing..."
              value={otherSymptoms}
              onChange={(e) => setOtherSymptoms(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <button className="bg-gray-100 px-4 py-2 rounded" onClick={handleReset}>
              Reset
            </button>
            <button
              className="bg-gray-800 text-white px-6 py-2 rounded"
              onClick={() => setStep(2)}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 2: Symptom Details</h2>

          <div className="space-y-4">
            <div>
              <p className="font-medium">How long have you been experiencing these symptoms?</p>
              {["Less than 24 hours", "1–3 days", "4–7 days", "1–2 weeks", "More than 2 weeks"].map((d) => (
                <label key={d} className="block mt-1">
                  <input
                    type="radio"
                    value={d}
                    checked={duration === d}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mr-2"
                  />
                  {d}
                </label>
              ))}
            </div>

            <div>
              <p className="font-medium">How severe are your symptoms?</p>
              {[
                "Mild - Noticeable but not interfering with daily activities",
                "Moderate - Somewhat interfering with daily activities",
                "Severe - Significantly interfering with daily activities",
                "Very Severe - Unable to perform daily activities",
              ].map((s) => (
                <label key={s} className="block mt-1">
                  <input
                    type="radio"
                    value={s}
                    checked={severity === s}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="mr-2"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <button className="bg-gray-100 px-4 py-2 rounded" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button
              className="bg-black text-white px-6 py-2 rounded"
              onClick={() => setStep(3)}
            >
              Get Assessment →
            </button>
          </div>
        </div>
      )}

{step === 3 && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Assessment</h2>
    <div className="bg-white border p-4 rounded space-y-2">
      <p><strong>Selected Symptoms:</strong> {selectedSymptoms.join(", ") || "None"}</p>
      <p><strong>Other:</strong> {otherSymptoms || "None"}</p>
      <p><strong>Duration:</strong> {duration}</p>
      <p><strong>Severity:</strong> {severity}</p>
      {aiAssessment && (
        <div className="mt-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
          <p><strong>AI Assessment:</strong></p>
          <p>{aiAssessment}</p>
        </div>
      )}
    </div>
    <div className="mt-4">
      <button
        className="bg-gray-100 px-4 py-2 rounded"
        onClick={() => setStep(1)}
      >
        Start Over
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default SymptomChecker;
