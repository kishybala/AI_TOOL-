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
  const emotionData = state?.emotionData;

  const getEmotionEmoji = (emotion) => {
    const emojiMap = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      fearful: "😨",
      disgusted: "🤢",
      surprised: "😲",
      neutral: "😐",
    };
    return emojiMap[emotion?.toLowerCase()] || "😊";
  };

  if (!aiResult)
    return (
      <div className="text-center mt-10 text-gray-600 text-lg">
        No results found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#7c677f] flex flex-col">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 md:px-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl bg-white/90 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 space-y-10"
        >
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center px-2"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700">
              Screening Results & Recommendations
            </h1>
            <motion.div
              className="h-1.5 w-32 sm:w-40 mx-auto mt-4 rounded-full bg-gradient-to-r from-blue-600 to-teal-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            <p className="text-gray-600 mt-4 text-base sm:text-lg leading-relaxed">
              Personalized therapy goals and activities for your child’s growth
            </p>
          </motion.div>

          {/* Emotion Detection Results */}
          {emotionData && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl overflow-hidden border border-purple-200 shadow-md"
            >
              <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 p-5 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-purple-700 mb-6 flex items-center gap-2">
                  🎭 Facial Emotion Analysis
                </h2>

                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
                  {/* Uploaded Photo */}
                  {emotionData.imagePreview && (
                    <div className="flex-shrink-0">
                      <img
                        src={emotionData.imagePreview}
                        alt="Child's photo"
                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-xl shadow-lg border-2 border-purple-300"
                      />
                    </div>
                  )}

                  {/* Emotion Details */}
                  <div className="flex-1 w-full">
                    {/* Dominant Emotion */}
                    <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 mb-4">
                      <p className="text-sm text-gray-500 mb-1">
                        Dominant Emotion Detected:
                      </p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700 capitalize">
                        {getEmotionEmoji(emotionData.dominantEmotion)}{" "}
                        {emotionData.dominantEmotion}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Confidence:{" "}
                        <span className="font-semibold text-gray-800">
                          {emotionData.confidence}%
                        </span>
                      </p>
                    </div>

                    {/* All Emotions */}
                    {emotionData.allEmotions && (
                      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
                        <p className="font-medium text-gray-700 mb-3">
                          All Detected Emotions:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {emotionData.allEmotions.slice(0, 6).map(
                            ({ emotion, confidence }) => (
                              <div
                                key={emotion}
                                className="flex justify-between items-center bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-2 rounded-lg border border-gray-100 shadow-sm text-sm sm:text-base"
                              >
                                <span className="capitalize font-medium text-gray-700 flex items-center gap-1">
                                  {getEmotionEmoji(emotion)} {emotion}
                                </span>
                                <span className="text-gray-600">
                                  {confidence}%
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Therapy Goals */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-teal-600 mb-4 flex items-center gap-2">
              🎯 Therapy Goals
            </h2>
            <ul className="space-y-4">
              {aiResult?.therapy_goals?.map((goal, i) => (
                <motion.li
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-teal-50 p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm"
                >
                  <div className="min-w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold rounded-full shadow-md">
                    {i + 1}
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed">
                    {goal}
                  </span>
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
            <h2 className="text-xl sm:text-2xl font-semibold text-teal-600 mb-4 flex items-center gap-2">
              🧩 Recommended Activities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {aiResult?.activities?.map((activity, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white p-4 sm:p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all"
                >
                  <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base leading-relaxed">
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
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-400 text-white rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
            >
              🔁 Check Again
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate("/pdf-report", {
                  state: { aiResult, formData, emotionData },
                })
              }
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white border border-gray-300 text-gray-800 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-gray-50 transition"
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
