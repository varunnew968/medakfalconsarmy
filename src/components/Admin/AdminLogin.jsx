import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check against environment variable (or fallback to prompt's default for safety in case env is missing)
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'MedakFalcons@2026';
    
    if (password === validPassword) {
      localStorage.setItem('mfa_admin_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-midnight-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-primary-orange/10 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-card-bg/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_0_40px_rgba(255,122,0,0.15)] text-center">
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-orange/20 flex items-center justify-center border border-primary-orange/50">
              <Lock className="text-primary-orange" size={28} />
            </div>
          </div>

          <h2 className="heading-md text-3xl mb-2 text-white">Admin <span className="text-primary-orange">Portal</span></h2>
          <p className="text-muted text-sm mb-8">Restricted access. Authorized personnel only.</p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-6 flex items-center gap-2 text-sm text-left"
            >
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Master Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#0A0D10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-orange/50 transition-colors"
                autoFocus
              />
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-primary-orange to-[#ff9533] text-white font-bold font-heading tracking-widest uppercase py-4 rounded-lg shadow-[0_10px_20px_rgba(255,122,0,0.3)] hover:shadow-[0_15px_30px_rgba(255,122,0,0.5)] transition-all"
            >
              Secure Login
            </motion.button>
          </form>
          
          <div className="mt-8 text-xs text-muted">
            <a href="/" className="hover:text-primary-orange transition-colors">← Back to Main Website</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
