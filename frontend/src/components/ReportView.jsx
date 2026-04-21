import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, ChevronRight, BarChart3, Fingerprint } from 'lucide-react';

const ReportView = ({ result }) => {
  if (!result) return null;

  const isHighRisk = result.risk_category === 'High';
  const isMedRisk = result.risk_category === 'Medium';

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
        >
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Diagnostic Report</h2>
            <p className="text-slate-500">Generated on {new Date().toLocaleDateString()} • ID: X-{Math.floor(Math.random()*10000)}</p>
          </div>
          
          <div className={`px-8 py-4 rounded-2xl flex items-center gap-4 ${
            isHighRisk ? 'bg-red-50 text-red-600 border border-red-100' : 
            isMedRisk ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
            'bg-green-50 text-green-600 border border-green-100'
          }`}>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Unified Risk Score</div>
              <div className="text-2xl font-black">{(result.probability * 100).toFixed(1)}%</div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-current flex items-center justify-center">
              {isHighRisk ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Visualization */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <Fingerprint className="text-medical-500" size={20} />
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Tumor Localization (Grad-CAM)</h4>
              </div>
              <div className="relative group overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
                <img src={result.explanation.image_heatmap} alt="Heatmap" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                   <p className="text-white text-sm font-medium">Heatmap indicates regions of high neural activation for predicted category.</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-xl flex items-start gap-3">
                <Info size={18} className="text-medical-500 shrink-0 mt-1" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  The model spotlighted specific textural patterns in the imaging data associated with <strong>{result.risk_category} Risk</strong> morphology.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Explanations */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Feature Importance */}
            <div className="card">
              <div className="flex items-center gap-2 mb-8">
                <BarChart3 className="text-medical-500" size={20} />
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Key Risk Drivers (SHAP)</h4>
              </div>
              <div className="space-y-6">
                {result.explanation.feature_importance.map((f, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{f.feature.replace('_', ' ')}</span>
                       <span className="text-xs font-bold text-medical-500">{(f.importance * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${f.importance * 100}%` }}
                        className={`h-full rounded-full ${isHighRisk ? 'bg-red-500' : 'bg-medical-500'}`}
                       ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verdict */}
            <div className={`card ${isHighRisk ? 'bg-red-50/50 border-red-100' : 'bg-medical-50/50 border-medical-100'}`}>
               <h4 className="font-bold text-slate-800 mb-4">Executive Summary</h4>
               <p className="text-sm text-slate-600 leading-relaxed mb-6">
                 Based on the multimodal analysis, the patient exhibits a <strong>{result.risk_category}</strong> risk profile. {isHighRisk ? 'Urgent follow-up and clinical correlation recommended.' : 'Routine monitoring and lifestyle adjustments suggested.'}
               </p>
               <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:shadow-md transition-all flex items-center justify-center gap-2">
                 Download Full PDF <ChevronRight size={14} />
               </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReportView;
