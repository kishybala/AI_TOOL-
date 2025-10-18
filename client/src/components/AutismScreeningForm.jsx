import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AutismScreeningForm = () => {
  const [formData, setFormData] = useState({
    ChildName: "",
    parentsName: "",
    age: "",
    eyeContact: "",
    speechLevel: "",
    socialResponse: "",
    sensoryReactions: "",
  });

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Backend 'sensoryReactions' ko ek array expect karta hai
    const dataToSend = {
      ...formData,
      sensoryReactions: [formData.sensoryReactions],
    };

   try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

  
   const aiResult = await response.json();
    
      navigate("/results", { state: { aiResult, formData } });

    } catch (err) {
      setError("Failed to get AI analysis. Please try again.");

      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 flex flex-col items-center">
      {/* Hero Section */}
      <motion.div
        className="text-center mt-16 px-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-400 shadow">
          ⚙️ AI-Powered + Emotion Recognition
        </h2>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-6">
          Empowering Early Autism Detection
        </h1>
        <motion.div
          className="h-2 w-56 mx-auto mt-4 rounded-full bg-gradient-to-r from-blue-600 to-teal-400"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />

        <p className="mt-6 text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg">
          A calm, intelligent space for screening and personalized therapy
          planning. Get AI-assisted insights tailored to your child’s unique
          needs.
        </p>

        <div className="flex justify-center gap-6 mt-6 text-sm">
          <span className="flex items-center gap-1 text-blue-600 font-medium">
            🧠 AI-Powered Analysis
          </span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            💬 Emotion Detection
          </span>
          <span className="flex items-center gap-1 text-pink-500 font-medium">
            ❤️ Personalized Care
          </span>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div
        className="mt-14 w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Child Assessment Form
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Please provide information about your child to receive personalized
          AI-powered recommendations and therapy suggestions.
        </p>

        {/* Error message display karein */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Child’s Name", name: "ChildName", type: "text", placeholder: "Enter child’s name" },
            { label: "Parents’s Name", name: "ParentsName", type: "text", placeholder: "Enter parents’s name" },
            { label: "Child’s Age", name: "age", type: "number", placeholder: "Enter age in years" },
          ].map((field, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <label className="block text-gray-700 mb-2 font-medium">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition hover:shadow-sm"
                required
              />
            </motion.div>
          ))}

          {/* Dropdown fields */}
          {[
            { label: "Eye Contact", name: "eyeContact", options: ["Good", "Moderate", "Poor"] },
            { label: "Speech Level", name: "speechLevel", options: ["Normal", "Delayed", "Non-verbal"] },
            { label: "Social Response", name: "socialResponse", options: ["Interactive", "Limited", "Withdrawn"] },
            { label: "Sensory Reactions", name: "sensoryReactions", options: ["Normal", "Sensitive", "Extreme"] },
          ].map((dropdown, i) => (
            <motion.div key={i + 10} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <label className="block text-gray-700 mb-2 font-medium">{dropdown.label}</label>
              <select
                name={dropdown.name}
                value={formData[dropdown.name]}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none transition hover:shadow-sm"
                required
              >
                <option value="">Select {dropdown.label.toLowerCase()}</option>
                {dropdown.options.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </motion.div>
          ))}

          {/* Animated Button - Loading state ke saath */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 mt-6 bg-gradient-to-r from-blue-600 to-teal-400 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "🚀 Analyze with AI"}
          </motion.button>
        </form>
      </motion.div>

      {/* Footer */}
      <footer className="mt-12 mb-6 text-center text-gray-500 text-sm">
        Built with 💙 by{" "}
        <span className="text-blue-600 font-medium">Sandhya Singh</span> — Avni HealthTech Project
      </footer>
    </div>
  );
};

export default AutismScreeningForm;