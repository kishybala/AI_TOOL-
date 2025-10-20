import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { aiResult, formData } = location.state || {};
  const pdfRef = useRef();


  const therapyGoals = aiResult?.therapy_goals || [];
  const recommendedActivities = aiResult?.activities || [];

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
      
      // Wait a bit for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(input, { 
        scale: 2,
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
          }
        },
        ignoreElements: (element) => {
      
          return element.classList && element.classList.contains('ignore-pdf');
        }
      });
      
      console.log('✅ Canvas created successfully');
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight);
      
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
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
        >
          <h1 className="text-3xl font-bold text-center" style={{ color: '#1f2937' }}>Child Assessment Report</h1>
          <p className="text-center mt-2" style={{ color: '#6b7280' }}>Generated on: {new Date().toLocaleDateString()}</p>
          <div className="h-1 w-40 mx-auto mt-4 rounded-full" style={{ backgroundColor: '#3b82f6' }} />

          {/* Child's Details */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold pb-2" style={{ color: '#1d4ed8', borderBottom: '2px solid #bfdbfe' }}>
              Child's Information
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4" style={{ color: '#374151' }}>
              <p><strong>Student's Name:</strong> {formData.ChildName}</p>
              <p><strong>Father's Name:</strong> {formData.ParentsName || formData.parentsName}</p>
              <p><strong>Age:</strong> {formData.age} years</p>
              <p><strong>Eye Contact:</strong> {formData.eyeContact}</p>
              <p><strong>Speech Level:</strong> {formData.speechLevel}</p>
              <p><strong>Social Response:</strong> {formData.socialResponse}</p>
              <p><strong>Sensory Reactions:</strong> {formData.sensoryReactions}</p>
            </div>
          </div>

          {/* Therapy Goals */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold pb-2" style={{ color: '#7c3aed', borderBottom: '2px solid #ddd6fe' }}>
              Therapy Goals
            </h2>
            <ul className="list-decimal list-inside mt-4 space-y-2" style={{ color: '#374151' }}>
              {therapyGoals.map((goal, index) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>
          </div>

          {/* Recommended Activities */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold pb-2" style={{ color: '#0f766e', borderBottom: '2px solid #99f6e4' }}>
              Recommended Activities
            </h2>
            <div className="mt-4 space-y-4">
              {recommendedActivities.map((activity, index) => (
                <div key={index} className="p-4 rounded-lg border" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                  <h3 className="font-semibold" style={{ color: '#1f2937' }}>{activity.title}</h3>
                  <p className="mt-1" style={{ color: '#4b5563' }}>{activity.description}</p>
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