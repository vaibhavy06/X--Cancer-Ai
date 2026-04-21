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

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
          {/* Image Upload Box */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="card flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-medical-400 transition-all min-h-[400px] relative overflow-hidden"
          >
            {!preview ? (
              <div className="text-center">
                <div className="bg-medical-50 p-6 rounded-full text-medical-500 mb-4 inline-block">
                  <Upload size={32} />
                </div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Upload Medical Image</h4>
                <p className="text-sm text-slate-500 mb-6 px-10">Drag and drop CT or Histopathology scans (JPG, PNG)</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
                <button type="button" className="text-medical-500 font-bold hover:underline">Browse Files</button>
              </div>
            ) : (
              <div className="w-full h-full p-2 flex flex-col">
                 <div className="flex-1 rounded-xl overflow-hidden shadow-lg border border-slate-100">
                    <img src={preview} alt="Scan Preview" className="w-full h-full object-cover" />
                 </div>
                 <button 
                  onClick={() => {setPreview(null); setImage(null);}}
                  className="mt-4 text-sm text-slate-400 hover:text-red-500 font-medium"
                 >
                   Remove and Replace
                 </button>
              </div>
            )}
          </motion.div>

          {/* Form Side */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                <ClipboardList size={20} />
              </div>
              <h4 className="text-lg font-bold text-slate-800">Patient History Data</h4>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label>
                  <input 
                    type="number" 
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="e.g. 54"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:border-medical-400 focus:ring-4 focus:ring-medical-50 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">BMI</label>
                  <input 
                    type="number" 
                    name="bmi"
                    value={formData.bmi}
                    onChange={handleInputChange}
                    placeholder="e.g. 24.5"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:border-medical-400 focus:ring-4 focus:ring-medical-50 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Smoking History</label>
                <select 
                  name="smoking_status"
                  value={formData.smoking_status}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:border-medical-400 focus:ring-4 focus:ring-medical-50 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="0">Never Smoked</option>
                  <option value="0.5">Former Smoker</option>
                  <option value="1">Occasional / Active Smoker</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Family Medical History</label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="family_history" 
                      value="0" 
                      checked={formData.family_history === '0'}
                      onChange={handleInputChange}
                      className="peer hidden" 
                    />
                    <div className="text-center p-3 rounded-xl border border-slate-100 bg-slate-50 peer-checked:bg-medical-50 peer-checked:border-medical-500 peer-checked:text-medical-600 transition-all">No History</div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="family_history" 
                      value="1" 
                      checked={formData.family_history === '1'}
                      onChange={handleInputChange}
                      className="peer hidden" 
                    />
                    <div className="text-center p-3 rounded-xl border border-slate-100 bg-slate-50 peer-checked:bg-medical-50 peer-checked:border-medical-500 peer-checked:text-medical-600 transition-all">Positive History</div>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !image}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8 h-[60px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Processing Multimodal Data...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} /> Run AI Diagnostics
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </form>
      </div>
    </section>
  );
};

export default AnalysisFlow;
