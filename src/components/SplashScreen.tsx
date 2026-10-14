import React from 'react';
import { Coffee, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { dismissSplash, settings } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#1b0f0a] via-[#2d1810] to-[#120a07] text-amber-50 p-6 select-none overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      {/* Top Bar Branding */}
      <div className="w-full flex items-center justify-between pt-6 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-xs uppercase tracking-widest text-amber-200/70 font-medium">POS Terminal v2.6</span>
        </div>
        <button
          onClick={dismissSplash}
          className="text-xs text-amber-300/80 hover:text-amber-200 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 active:scale-95"
        >
          Skip <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center 3D Coffee Cup Visual */}
      <div className="flex flex-col items-center my-auto text-center max-w-sm">
        <div className="relative mb-8 flex items-center justify-center">
          {/* Glowing Aura */}
          <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-amber-600/30 via-amber-500/20 to-transparent blur-xl animate-pulse" />
          
          {/* Steam Elements */}
          <div className="absolute -top-10 flex gap-4 text-amber-300/40 pointer-events-none">
            <span className="animate-steam font-serif text-3xl font-light" style={{ animationDelay: '0s' }}>~</span>
            <span className="animate-steam font-serif text-4xl font-light" style={{ animationDelay: '0.8s' }}>~</span>
            <span className="animate-steam font-serif text-3xl font-light" style={{ animationDelay: '1.6s' }}>~</span>
          </div>

          {/* 3D Coffee Cup Emblem */}
          <div className="relative w-36 h-36 rounded-3xl bg-gradient-to-br from-amber-700 via-[#3E2723] to-[#1B0F0A] p-1 shadow-2xl shadow-amber-950/80 border border-amber-500/30 flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full rounded-2xl bg-gradient-to-b from-[#2D1810] to-[#180d08] flex flex-col items-center justify-center border border-amber-400/20 shadow-inner">
              <Coffee className="w-16 h-16 text-amber-400 drop-shadow-[0_4px_12px_rgba(212,163,115,0.4)]" />
              <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold tracking-wider text-amber-200/90">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>3D POS</span>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 font-heading">
          {settings.shopName}
        </h1>
        <p className="text-sm text-amber-200/75 leading-relaxed px-4">
          {settings.tagline}
        </p>
        <p className="text-xs text-amber-400/60 mt-3 font-mono">
          Offline Billing • Inventory • Thermal Print
        </p>
      </div>

      {/* Bottom Start Action */}
      <div className="w-full max-w-sm pb-8 flex flex-col items-center gap-3">
        <button
          onClick={dismissSplash}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-stone-950 font-bold text-base shadow-xl shadow-amber-900/40 hover:from-amber-400 hover:to-amber-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Launch Coffee POS</span>
          <ArrowRight className="w-5 h-5 text-stone-950" />
        </button>
        <span className="text-[11px] text-amber-300/50">
          Ready for Android Tablets & Phones • ₹ INR Standard
        </span>
      </div>
    </div>
  );
};
