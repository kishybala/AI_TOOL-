import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { aiResult, formData, emotionData } = location.state || {};
  const pdfRef = useRef();


  const therapyGoals = aiResult?.therapy_goals || [];
  const recommendedActivities = aiResult?.activities || [];

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

  if (!formData || !aiResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-xl text-gray-700">No data found. Please fill out the form first.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md"
        >
          Go to Form
        </button>
      </div>
    );
  }

  const downloadPDF = async () => {
    try {
      const input = pdfRef.current;
      if (!input) {
        alert('Report content not found. Please refresh and try again.');
        return;
      }

      console.log('🔄 Starting PDF generation...');
      
      // Wait for animations and images to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create canvas with optimized settings for single-page PDF
      const canvas = await html2canvas(input, { 
        scale: 1.5, // Better quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-pdf-content]');
          if (clonedElement) {
            clonedElement.style.color = '#000000';
            // Professional padding
            clonedElement.style.padding = '25px';
          }
        },
        ignoreElements: (element) => {
          return element.classList && element.classList.contains('ignore-pdf');
        }
      });
      
      console.log('✅ Canvas created successfully');
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95); // High quality
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate aspect ratio to fit content on one page with proper margins
      const ratio = Math.min(
        (pdfWidth - 15) / imgWidth,  // 7.5mm margin on each side
        (pdfHeight - 15) / imgHeight  // 7.5mm margin top and bottom
      );
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      // Center the content on the page
      const xOffset = (pdfWidth - scaledWidth) / 2;
      const yOffset = (pdfHeight - scaledHeight) / 2;
      
      // Add image to PDF, scaled to fit one page
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, scaledWidth, scaledHeight);
      
      const fileName = `AutismReport_${formData?.ChildName?.replace(/\s+/g, '_') || 'Report'}.pdf`;
      pdf.save(fileName);
      
      console.log('✅ PDF downloaded successfully:', fileName);
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      console.error('Error details:', error.message, error.stack);
      alert(`Failed to generate PDF: ${error.message}. Check console for details.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* == PDF CONTENT START == */}
        <motion.div
          ref={pdfRef}
          data-pdf-content
          className="bg-white rounded-2xl shadow-lg p-8 border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
        >
          <h1 className="text-2xl font-bold text-center mb-1" style={{ color: '#1f2937', letterSpacing: '0.5px' }}>
            Child Assessment Report
          </h1>
          <p className="text-center text-sm" style={{ color: '#6b7280' }}>
            Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="h-1 w-32 mx-auto mt-3 rounded-full" style={{ backgroundColor: '#3b82f6' }} />

          {/* Child's Details */}
          <div className="mt-6">
            <h2 className="text-lg font-bold pb-2 mb-3" style={{ color: '#1d4ed8', borderBottom: '2px solid #3b82f6' }}>
              Child's Information
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm" style={{ color: '#374151' }}>
              <p><strong className="font-semibold" style={{ color: '#1f2937' }}>Student Name:</strong> {formData.ChildName}</p>
              <p><strong className="font-semibold" style={{ color: '#1f2937' }}>Father Name:</strong> {formData.ParentsName || formData.parentsName}</p>
              <p><strong className="font-semibold" style={{ color: '#1f2937' }}>Age:</strong> {formData.age} years</p>
              <p><strong className="font-semibold" style={{ color: '#1f2937' }}>Eye Contact:</strong> {formData.eyeContact}</p>
              <p><strong className="font-semibold" style={{ color: '#1f2937' }}>Speech Level:</strong> {formData.speechLevel}</p>
              <p><strong className="font-semibold" style={{ color: '#1f2937' }}>Social Response:</strong> {formData.socialResponse}</p>
              <p className="col-span-2"><strong className="font-semibold" style={{ color: '#1f2937' }}>Sensory Reactions:</strong> {formData.sensoryReactions}</p>
            </div>
          </div>

          {/* Emotion Detection Results */}
          {emotionData && (
            <div className="mt-6">
              <h2 className="text-lg font-bold pb-2 mb-3" style={{ color: '#9333ea', borderBottom: '2px solid #a855f7' }}>
                Facial Emotion Analysis
              </h2>
              <div className="text-sm" style={{ color: '#374151' }}>
                {/* Emotion Details - No Photo */}
                <div className="max-w-md">
                  <p className="font-semibold mb-2 text-base" style={{ color: '#1f2937' }}>Dominant Emotion:</p>
                  <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#faf5ff', border: '2px solid #e9d5ff' }}>
                    <p className="text-xl font-bold capitalize mb-1" style={{ color: '#9333ea' }}>
                      {getEmotionEmoji(emotionData.dominantEmotion)} {emotionData.dominantEmotion}
                    </p>
                    <p className="text-sm" style={{ color: '#6b7280' }}>
                      Confidence: <strong>{emotionData.confidence}%</strong>
                    </p>
                  </div>
                  
                  {emotionData.allEmotions && (
                    <div>
                      <p className="font-semibold mb-2 text-base" style={{ color: '#1f2937' }}>All Detected Emotions:</p>
                      <div className="space-y-2 text-sm">
                        {emotionData.allEmotions.slice(0, 4).map(({ emotion, confidence }) => (
                          <div key={emotion} className="flex justify-between items-center py-1 px-3 rounded" style={{ backgroundColor: '#f3f4f6' }}>
                            <span className="capitalize font-medium">{getEmotionEmoji(emotion)} {emotion}</span>
                            <span className="font-semibold" style={{ color: '#9333ea' }}>{confidence}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Therapy Goals */}
          <div className="mt-6">
            <h2 className="text-lg font-bold pb-2 mb-3" style={{ color: '#7c3aed', borderBottom: '2px solid #a78bfa' }}>
              Therapy Goals
            </h2>
            <ul className="list-none space-y-2.5 text-sm" style={{ color: '#374151' }}>
              {therapyGoals.map((goal, index) => (
                <li key={index} className="flex items-start leading-relaxed">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white font-bold mr-3 flex-shrink-0" style={{ backgroundColor: '#7c3aed', fontSize: '12px' }}>
                    {index + 1}
                  </span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Activities */}
          <div className="mt-6">
            <h2 className="text-lg font-bold pb-2 mb-3" style={{ color: '#0f766e', borderBottom: '2px solid #14b8a6' }}>
              Recommended Activities
            </h2>
            <div className="space-y-3">
              {recommendedActivities.map((activity, index) => (
                <div key={index} className="p-4 rounded-lg border-l-4" style={{ backgroundColor: '#f0fdfa', borderColor: '#14b8a6' }}>
                  <h3 className="font-bold text-sm mb-1.5" style={{ color: '#0f766e' }}>
                    {index + 1}. {activity.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                    {activity.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        {/* == PDF CONTENT END == */}

        {/* Action Buttons */}
        <motion.div
          className="text-center mt-8 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-full shadow-lg hover:bg-gray-300 transition-transform"
          >
            Check Again
          </button>
          <button
            onClick={downloadPDF}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            📄 Download Report as PDF
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;