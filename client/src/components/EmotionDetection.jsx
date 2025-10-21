import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { motion } from "framer-motion";

const EmotionDetection = ({ onEmotionDetected }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [emotions, setEmotions] = useState(null);
  const [error, setError] = useState(null);
  const imgRef = useRef();
  const canvasRef = useRef();

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models"; // Models will be in public/models folder
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log("✅ Face-api models loaded successfully!");
      } catch (err) {
        console.error("❌ Error loading models:", err);
        setError("Failed to load emotion detection models. Please refresh the page.");
      }
    };
    loadModels();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setEmotions(null);
      setError(null);
    }
  };

  const detectEmotions = async () => {
    if (!image || !modelsLoaded) {
      setError("Please upload an image and wait for models to load.");
      return;
    }

    setDetecting(true);
    setError(null);

    try {
      const img = imgRef.current;
      
      // Detect face with expressions
      const detections = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detections) {
        setError("No face detected in the image. Please upload a clear photo of the child's face.");
        setDetecting(false);
        return;
      }

      // Get emotions
      const expressions = detections.expressions;
      
      // Find dominant emotion
      const emotionArray = Object.entries(expressions).map(([emotion, confidence]) => ({
        emotion,
        confidence: (confidence * 100).toFixed(2),
      }));
      
      emotionArray.sort((a, b) => b.confidence - a.confidence);
      
      const dominantEmotion = emotionArray[0];
      
      setEmotions({
        dominant: dominantEmotion,
        all: emotionArray,
      });

      // Draw detections on canvas
      const canvas = canvasRef.current;
      const displaySize = { width: img.width, height: img.height };
      faceapi.matchDimensions(canvas, displaySize);
      
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      
      // Clear canvas
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw face detection box
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      
      // Pass emotion data to parent component
      if (onEmotionDetected) {
        onEmotionDetected({
          dominantEmotion: dominantEmotion.emotion,
          confidence: dominantEmotion.confidence,
          allEmotions: emotionArray,
          imagePreview: imagePreview,
        });
      }

    } catch (err) {
      console.error("Error detecting emotions:", err);
      setError("Error detecting emotions. Please try another image.");
    } finally {
      setDetecting(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    setEmotions(null);
    setError(null);
    if (onEmotionDetected) {
      onEmotionDetected(null);
    }
  };

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
    return emojiMap[emotion] || "😊";
  };

  const getEmotionColor = (emotion) => {
    const colorMap = {
      happy: "text-green-600",
      sad: "text-blue-600",
      angry: "text-red-600",
      fearful: "text-purple-600",
      disgusted: "text-yellow-600",
      surprised: "text-orange-600",
      neutral: "text-gray-600",
    };
    return colorMap[emotion] || "text-gray-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
          📸 Facial Emotion Detection
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload a clear photo of the child's face to detect emotions using AI
        </p>

        {/* Upload Button */}
        {!imagePreview && (
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="cursor-pointer border-2 border-dashed border-purple-300 rounded-xl p-6 text-center hover:border-purple-500 hover:bg-purple-50 transition">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-gray-700 font-medium">Click to upload photo</p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </label>
        )}

        {/* Image Preview and Detection */}
        {imagePreview && (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                ref={imgRef}
                src={imagePreview}
                alt="Uploaded"
                className="max-w-full h-auto rounded-lg shadow-md max-h-80"
                onLoad={() => {
                  if (canvasRef.current && imgRef.current) {
                    canvasRef.current.width = imgRef.current.width;
                    canvasRef.current.height = imgRef.current.height;
                  }
                }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 pointer-events-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={detectEmotions}
                disabled={detecting || !modelsLoaded}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium shadow-md hover:opacity-90 transition disabled:opacity-50"
              >
                {detecting ? "🔄 Detecting..." : modelsLoaded ? "🎯 Detect Emotions" : "⏳ Loading Models..."}
              </button>
              <button
                onClick={clearImage}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium shadow-md hover:bg-gray-300 transition"
              >
                🗑️ Clear
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            {/* Emotion Results */}
            {emotions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-4 shadow-lg border border-purple-200"
              >
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  🎭 Detected Emotions
                </h4>

                {/* Dominant Emotion */}
                <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Dominant Emotion:</p>
                  <p className={`text-2xl font-bold capitalize ${getEmotionColor(emotions.dominant.emotion)}`}>
                    {getEmotionEmoji(emotions.dominant.emotion)} {emotions.dominant.emotion}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Confidence: {emotions.dominant.confidence}%
                  </p>
                </div>

                {/* All Emotions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">All Detected Emotions:</p>
                  {emotions.all.map(({ emotion, confidence }) => (
                    <div key={emotion} className="flex items-center justify-between">
                      <span className="text-sm capitalize flex items-center gap-2">
                        <span>{getEmotionEmoji(emotion)}</span>
                        <span className={getEmotionColor(emotion)}>{emotion}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12">{confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Emotion data will be included in the assessment report!
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {!modelsLoaded && !error && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="text-sm text-gray-600 mt-2">Loading AI models...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EmotionDetection;
