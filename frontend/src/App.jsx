import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnalysisFlow from './components/AnalysisFlow';
import ReportView from './components/ReportView';
import { Activity } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (image, patientData) => {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('patient_data', JSON.stringify(patientData));

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/predict', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setResult(data);
      
      // Scroll to result after a short delay
      setTimeout(() => {
        document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      
    } catch (error) {
      console.error('Error predicting:', error);
      alert('Connection Error: Is the backend server running at 127.0.0.1:8000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-medical-100 selection:text-medical-900">
      <Navbar />
      
      <main>
        <Hero />
        
        <AnalysisFlow onAnalyze={handleAnalyze} loading={loading} />
        
        <div id="report">
          {result && <ReportView result={result} />}
        </div>
      </main>

      <footer className="bg-slate-900 py-16 text-center text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
             <div className="bg-white/10 p-3 rounded-2xl text-white">
                <Activity size={32} /> 
             </div>
             <p className="font-bold text-white tracking-widest uppercase text-sm">X-Cancer AI Systems</p>
          </div>
          <p className="mt-8 text-sm max-w-xl mx-auto leading-relaxed border-t border-slate-800 pt-8">
            Pioneering explainable deep learning for oncology. Our multi-modal engine combines vision and clinical data for unmatched predictive transparency.
          </p>
          <div className="mt-12 text-[10px] uppercase font-bold tracking-widest text-slate-600">
            © 2026 X-Cancer AI • For Research Purposes Only • Built for Excellence
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
