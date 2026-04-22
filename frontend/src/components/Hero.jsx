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

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1, 
              type: "spring", 
              stiffness: 100, 
              damping: 20 
            }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[2.5rem] border-[12px] border-white shadow-2xl overflow-hidden relative group">
              <img 
                src="/hero_lab.png" 
                alt="Medical Lab" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-medical-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-medical-200">
                   <Activity size={24} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Live Diagnostics</div>
                  <div className="text-base font-black text-slate-800">Processing...</div>
                </div>
              </motion.div>
            </div>
            
            {/* Background blur decorative element */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-medical-300 rounded-full blur-3xl opacity-30 -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
