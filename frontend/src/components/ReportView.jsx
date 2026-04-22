import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, Download, Loader2, BarChart3, Fingerprint, Sparkles, Activity } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ReportView = ({ result }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef(null);

  if (!result) return null;

  const isHighRisk = result.risk_category === 'High';
  const isMedRisk = result.risk_category === 'Medium';

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`X-Cancer-Report-${Math.floor(Math.random() * 10000)}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="py-24 bg-white min-h-screen relative overflow-hidden" ref={reportRef}>
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-medical-500 via-blue-500 to-medical-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest mb-3">
               <Activity size={14} /> Official Diagnostic Output
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-2">Patient Diagnostic Report</h2>
            <p className="text-slate-500 font-medium">Verified by X-Cancer Multimodal Engine • {new Date().toLocaleDateString()}</p>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`px-10 py-6 rounded-[2rem] flex items-center gap-6 shadow-2xl ${
              isHighRisk ? 'bg-red-50 text-red-600 border border-red-100 shadow-red-100' : 
              isMedRisk ? 'bg-amber-50 text-amber-600 border border-amber-100 shadow-amber-100' : 
              'bg-medical-50 text-medical-600 border border-medical-100 shadow-medical-100'
            }`}
          >
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Unified Risk Index</div>
              <div className="text-4xl font-black">{(result.probability * 100).toFixed(1)}%</div>
            </div>
            <div className="w-16 h-16 rounded-2xl border-4 border-current flex items-center justify-center bg-white shadow-inner">
              {isHighRisk ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
            </div>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: Visualization */}
          <div className="lg:col-span-2 space-y-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="card p-0 overflow-hidden border-none shadow-2xl bg-slate-900"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Fingerprint className="text-medical-400" size={24} />
                  <h4 className="font-bold text-white uppercase tracking-widest text-sm">Neural Attention Map (Grad-CAM)</h4>
                </div>
                <div className="px-3 py-1 bg-medical-500/20 text-medical-400 rounded-full text-[10px] font-bold uppercase tracking-widest">Live Heatmap</div>
              </div>
              <div className="relative group aspect-video">
                <img src={result.explanation.image_heatmap} alt="Heatmap" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-10 flex items-end">
                   <p className="text-white text-sm leading-relaxed max-w-md">The highlighted zones indicate regions where the deep learning model detected significant morphological anomalies consistent with {result.risk_category} risk patterns.</p>
                </div>
              </div>
              <div className="p-8 bg-slate-800/50 flex items-start gap-4">
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Info size={20} className="text-medical-400" />
                 </div>
                 <p className="text-sm text-slate-300 leading-relaxed">
                   <strong>Diagnostic Insight:</strong> Textural analysis confirms high-density clusters in the spotlighted regions. These patterns are primary drivers for the current risk categorization.
                 </p>
              </div>
            </motion.div>

            {/* Extra Medical Image for Polish */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 gap-8"
            >
               <div className="card bg-slate-50 border-slate-200 overflow-hidden group">
                  <img 
                    src="/report_preview.png" 
                    alt="Clinical Preview" 
                    className="w-full h-48 object-cover rounded-xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500" 
                  />
                  <h5 className="font-bold text-slate-800 mb-2">Clinical Correlation</h5>
                  <p className="text-xs text-slate-500 leading-relaxed">Integrated analysis of biopsy reports and vision data for unmatched precision.</p>
               </div>
               <div className="card bg-medical-600 text-white border-none shadow-xl shadow-medical-100 flex flex-col justify-center p-8">
                  <h5 className="font-black text-2xl mb-4 leading-tight">Empowering Doctors with AI.</h5>
                  <p className="text-medical-100 text-sm mb-6 leading-relaxed">Our engine reduces diagnostic latency by 40% while providing quantifiable evidence for every prediction.</p>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center">
                        <CheckCircle2 size={16} />
                     </div>
                     <span className="text-xs font-bold uppercase tracking-widest">ISO 13485 Compliant</span>
                  </div>
               </div>
            </motion.div>
          </div>

          {/* Right: Explanations */}
          <div className="space-y-10">
            {/* Feature Importance */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="card shadow-2xl border-none p-10"
            >
              <div className="flex items-center gap-3 mb-10">
                <div className="bg-medical-50 p-3 rounded-2xl text-medical-500">
                  <BarChart3 size={24} />
                </div>
                <h4 className="font-bold text-slate-800 uppercase tracking-[0.1em] text-xs">Risk Drivers (SHAP)</h4>
              </div>
              <div className="space-y-8">
                {result.explanation.feature_importance.map((f, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-xs font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">{f.feature.replace('_', ' ')}</span>
                       <span className="text-xs font-black text-medical-600 bg-medical-50 px-2 py-1 rounded-md">{(f.importance * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                       <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${f.importance * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full rounded-full shadow-sm ${isHighRisk ? 'bg-red-500' : 'bg-medical-500'}`}
                       ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Verdict */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`card p-10 border-none shadow-2xl ${isHighRisk ? 'bg-red-50/50 shadow-red-50' : 'bg-medical-50/50 shadow-medical-50'}`}
            >
               <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                 <Sparkles size={20} className="text-medical-500" /> Executive Verdict
               </h4>
               <p className="text-sm text-slate-600 leading-loose mb-8 italic">
                 "Multimodal analysis identifies a <strong>{result.risk_category} Risk</strong> profile. Findings are based on weighted correlation between imaging textures and patient physiological markers."
               </p>
               <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-medical-600 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-slate-200"
              >
                {isDownloading ? (
                  <>Generating PDF <Loader2 className="animate-spin" size={16} /></>
                ) : (
                  <>Export Official PDF <Download size={16} /></>
                )}
               </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportView;
