import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, User, ClipboardList, Loader2, Sparkles } from 'lucide-react';

const AnalysisFlow = ({ onAnalyze, loading }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    blood_pressure: '',
    cholesterol: '',
    family_history: '0',
    smoking_status: '0'
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(image, formData);
  };

  return (
    <section id="analyze" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Risk Analysis Engine</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Upload medical imaging and patient history to generate a comprehensive risk assessment powered by multimodal AI.</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          onSubmit={handleSubmit} 
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Image Upload Box */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="card group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-medical-400 transition-all min-h-[450px] overflow-hidden"
          >
            {!preview ? (
              <div className="text-center p-8">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-medical-50 p-8 rounded-[2rem] text-medical-500 mb-6 inline-block shadow-inner"
                >
                  <Upload size={40} />
                </motion.div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">Upload Medical Imaging</h4>
                <p className="text-sm text-slate-500 mb-8 max-w-[280px] mx-auto leading-relaxed">Drag and drop clinical scans. Our AI supports CT, MRI, and Histopathology formats.</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  required
                />
                <button type="button" className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-medical-600 transition-colors">Browse Library</button>
              </div>
            ) : (
              <div className="w-full h-full p-4 flex flex-col relative group">
                 <div className="flex-1 rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative">
                    <img src={preview} alt="Scan Preview" className="w-full h-full object-cover" />
                    {/* Scanning Animation */}
                    <motion.div 
                      initial={{ top: '-10%' }}
                      animate={{ top: '110%' }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-medical-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20"
                    ></motion.div>
                    <div className="absolute inset-0 bg-medical-500/10 mix-blend-overlay"></div>
                 </div>
                 <button 
                  onClick={() => {setPreview(null); setImage(null);}}
                  className="mt-6 text-sm text-slate-400 hover:text-red-500 font-bold uppercase tracking-widest transition-colors"
                 >
                   Discard and Select New Scan
                 </button>
              </div>
            )}
          </motion.div>

          {/* Form Side */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="card bg-white shadow-xl border border-slate-100 p-10"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-medical-500 p-3 rounded-2xl text-white shadow-lg shadow-medical-200">
                <ClipboardList size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800">Clinical Data</h4>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Patient History Profile</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Age</label>
                  <input 
                    type="number" 
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Years"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-50 outline-none transition-all font-semibold"
                    required
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">BMI Index</label>
                  <input 
                    type="number" 
                    name="bmi"
                    value={formData.bmi}
                    onChange={handleInputChange}
                    placeholder="kg/m²"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-50 outline-none transition-all font-semibold"
                    required
                  />
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tobacco Usage</label>
                <select 
                  name="smoking_status"
                  value={formData.smoking_status}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-50 outline-none transition-all appearance-none cursor-pointer font-semibold text-slate-700"
                >
                  <option value="0">Non-Smoker</option>
                  <option value="0.5">Former Smoker</option>
                  <option value="1">Active Smoker</option>
                </select>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hereditary Risk (Family History)</label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="family_history" 
                      value="0" 
                      checked={formData.family_history === '0'}
                      onChange={handleInputChange}
                      className="peer hidden" 
                    />
                    <div className="text-center p-4 rounded-2xl border border-slate-200 bg-slate-50/50 peer-checked:bg-medical-500 peer-checked:border-medical-500 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-medical-100 transition-all font-bold text-sm text-slate-500">None</div>
                  </label>
                  <label className="flex-1 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="family_history" 
                      value="1" 
                      checked={formData.family_history === '1'}
                      onChange={handleInputChange}
                      className="peer hidden" 
                    />
                    <div className="text-center p-4 rounded-2xl border border-slate-200 bg-slate-50/50 peer-checked:bg-red-500 peer-checked:border-red-500 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-red-100 transition-all font-bold text-sm text-slate-500">Positive</div>
                  </label>
                </div>
              </motion.div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading || !image}
                className="w-full bg-slate-900 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8 h-[70px] font-black uppercase tracking-widest hover:bg-medical-600 transition-all shadow-xl shadow-slate-200 overflow-hidden relative"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} /> 
                    <span className="animate-pulse">Analyzing Multimodal Fusion...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} className="text-medical-400" /> Run Advanced AI Diagnostics
                  </>
                )}
                {/* Button shine effect */}
                <motion.div 
                  animate={{ left: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-20 bg-white/10 skew-x-[45deg] z-10"
                ></motion.div>
              </motion.button>
            </div>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
};

export default AnalysisFlow;
