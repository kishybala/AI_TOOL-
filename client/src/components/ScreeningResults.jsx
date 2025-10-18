import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";



const ScreeningResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const aiResult = state?.aiResult;
  const formData = state?.formData; 

  if (!aiResult)
    return <div className="text-center mt-10">No results found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-6 flex flex-col items-center">
        <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-lg space-y-8 border border-gray-100">

          <div className="text-center">
            <h1 className="text-3xl font-bold text-indigo-700">Screening Results & Recommendations</h1>
            <p className="text-gray-600 mt-2">
              Personalized therapy goals and activities for your child's growth
            </p>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">Therapy Goals</h2>
            <ul className="space-y-3">
              {aiResult?.therapy_goals?.map((goal, i) => (
                <li key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="w-7 h-7 flex items-center justify-center bg-indigo-100 text-indigo-700 font-semibold rounded-full">
                    {i + 1}
                  </div>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">Recommended Activities</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {aiResult?.activities?.map((activity, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                  <p className="text-gray-600 mt-1">{activity.description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Check Again
            </button>
            <button 
              onClick={() => navigate("/pdf-report", { state: { aiResult, formData } })}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition">
              Download PDF
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScreeningResults;
