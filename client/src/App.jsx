import { BrowserRouter, Routes, Route } from "react-router-dom";
import AutismScreeningForm from "./components/AutismScreeningForm";
import ScreeningResults from "./components/ScreeningResults";
import ResultsPage from './components/ResultsPage'; 
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AutismScreeningForm />} />
        <Route path="/results" element={<ScreeningResults />} />
         <Route path="/results" element={<ResultsPage />} /> {/* Is line ko add karein */}
         <Route path="/pdf-report" element={<ResultsPage />} /> {/* Ye nayi line add karein */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;