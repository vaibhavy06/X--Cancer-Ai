import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, BrainCircuit, Activity } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 opacity-20">
        <div className="w-[600px] h-[600px] bg-medical-400 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-medical-50 text-medical-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <BrainCircuit size={18} />
              Next-Gen Medical Intelligence
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
              AI-Powered Early <br />
              <span className="text-medical-500">Cancer Detection</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              Empowering healthcare professionals with state-of-the-art multimodal AI. Predict risk levels using images and clinical data with complete transparency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a href="#analyze" className="btn-primary flex items-center justify-center gap-2">
                Start Analysis <ArrowRight size={18} />
              </a>
              <button className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all">
                Learn Methodology
              </button>
            </div>

            <div className="flex items-center gap-6 text-slate-500">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-medical-500" /> 98% Accuracy
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-medical-500" /> Explainable AI
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-medical-500" /> HIPAA Compliant
              </div>
            </div>
          </motion.div>

          {/* Hero Illustration Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square bg-white rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-medical-50 to-white"></div>
              {/* Stylized UI Preview */}
              <div className="absolute inset-8 border border-slate-100 rounded-2xl bg-white/50 backdrop-blur-sm p-6 shadow-inner">
                 <div className="w-1/2 h-4 bg-slate-200 rounded-full mb-4"></div>
                 <div className="w-3/4 h-4 bg-slate-100 rounded-full mb-8"></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-medical-100 rounded-xl animate-pulse"></div>
                    <div className="h-24 bg-slate-50 rounded-xl"></div>
                 </div>
                 <div className="mt-6 space-y-3">
                    <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                    <div className="h-2 w-5/6 bg-slate-100 rounded-full"></div>
                 </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute bottom-4 right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                   <Activity size={20} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Risk Level</div>
                  <div className="text-sm font-bold text-slate-800">LOW RISK</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
