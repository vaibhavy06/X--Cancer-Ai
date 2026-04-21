import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Shield, Activity } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-medical-500 p-2 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              X-Cancer <span className="text-medical-500">AI</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-medical-500 transition-colors">Home</a>
            <a href="#analyze" className="text-sm font-medium text-slate-600 hover:text-medical-500 transition-colors">Analyze</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-medical-500 transition-colors">About</a>
            <button className="bg-medical-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-medical-600 transition-all">
              Launch App
            </button>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-slate-100 p-4 space-y-4"
        >
          <a href="#" className="block px-4 py-2 text-slate-600 font-medium">Home</a>
          <a href="#analyze" className="block px-4 py-2 text-slate-600 font-medium">Analyze</a>
          <a href="#" className="block px-4 py-2 text-slate-600 font-medium">About</a>
          <button className="w-full bg-medical-500 text-white py-3 rounded-xl font-semibold">
            Launch App
          </button>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
