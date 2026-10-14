import React, { useState } from 'react';
import { Coffee, Lock, Mail, Eye, EyeOff, ShieldCheck, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  const { login, settings } = useApp();
  const [email, setEmail] = useState('admin@brewandhearth.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'cashier'>('admin');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    setError('');
    login(email, selectedRole, selectedRole === 'admin' ? 'Aditi M. (Manager)' : 'Rahul K. (Barista)');
    if (onDismiss) onDismiss();
  };

  const handleQuickDemo = (role: 'admin' | 'cashier') => {
    if (role === 'admin') {
      setEmail('admin@brewandhearth.in');
      setPassword('admin2026');
      setSelectedRole('admin');
      login('admin@brewandhearth.in', 'admin', 'Aditi M. (Manager)');
    } else {
      setEmail('cashier@brewandhearth.in');
      setPassword('barista123');
      setSelectedRole('cashier');
      login('cashier@brewandhearth.in', 'cashier', 'Rahul K. (Barista)');
    }
    if (onDismiss) onDismiss();
  };

  return (
    <div className="min-h-full flex flex-col justify-center items-center p-6 bg-gradient-to-b from-[#1b0f0a] via-[#24130d] to-[#120a07] text-stone-100">
      <div className="w-full max-w-sm bg-[#2D1810]/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-7 shadow-2xl shadow-black/60">
        {/* Brand Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-900/50 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-[#20100a] rounded-[14px] flex items-center justify-center">
              <Coffee className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white font-heading">
            {settings.shopName}
          </h2>
          <p className="text-xs text-amber-300/70 mt-1">
            Point of Sale & Admin Terminal
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 p-1 bg-[#1a0e09] rounded-xl border border-amber-900/40 mb-5">
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'admin'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-amber-200/60 hover:text-amber-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin / Manager
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('cashier')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'cashier'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-amber-200/60 hover:text-amber-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Barista / Cashier
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-700/50 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-amber-200/80 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amber-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1b0f0a] border border-amber-900/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-stone-100 focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="admin@coffeeshop.in"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-amber-200/80 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1b0f0a] border border-amber-900/50 rounded-xl py-2.5 pl-10 pr-10 text-sm text-stone-100 focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm shadow-lg shadow-amber-950/60 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] transition-all"
          >
            Sign In to POS
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="mt-6 pt-5 border-t border-amber-900/40 text-center">
          <p className="text-[11px] text-amber-300/60 mb-2">Quick 1-Tap Demo Access</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="flex-1 py-1.5 px-2 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-lg text-[11px] font-medium text-amber-200 transition-colors"
            >
              Manager Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('cashier')}
              className="flex-1 py-1.5 px-2 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-lg text-[11px] font-medium text-amber-200 transition-colors"
            >
              Barista Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
