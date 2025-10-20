import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

const ScreeningResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const aiResult = state?.aiResult;
  const formData = state?.formData;

  if (!aiResult)
    return (
      <div className="text-center mt-10 text-gray-600 text-lg">
        No results found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#7c677f] from-blue-50 via-white to-teal-50 flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl w-full bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-100 space-y-10"
        >
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-blue-700">
              Screening Results & Recommendations
            </h1>
            <motion.div
              className="h-1.5 w-40 mx-auto mt-4 rounded-full bg-gradient-to-r from-blue-600 to-teal-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            <p className="text-gray-600 mt-4 text-lg">
              Personalized therapy goals and activities for your child’s growth
            </p>
          </motion.div>

          {/* Therapy Goals */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-teal-600 mb-4 flex items-center gap-2">
              🎯 Therapy Goals
            </h2>
            <ul className="space-y-4">
              {aiResult?.therapy_goals?.map((goal, i) => (
                <motion.li
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-xl border border-gray-100 shadow-sm"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold rounded-full shadow-md">
                    {i + 1}
                  </div>
                  <span className="text-gray-700 font-medium">{goal}</span>
                </motion.li>
              ))}
            </ul>
          </motion.section>

          {/* Recommended Activities */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-teal-600 mb-4 flex items-center gap-2">
              🧩 Recommended Activities
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {aiResult?.activities?.map((activity, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all"
                >
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    {activity.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-6 pt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-400 text-white rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
            >
              🔁 Check Again
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate("/pdf-report", { state: { aiResult, formData } })
              }
              className="px-8 py-3 bg-white border border-gray-300 text-gray-800 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-gray-50 transition"
            >
              📄 Download PDF
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ScreeningResults;
