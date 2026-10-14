import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AndroidFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceMode, setDeviceMode } = useApp();
  const [currentTime, setCurrentTime] = useState('10:45');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center p-0 md:p-4 select-none">
      {/* Top Desktop Controls Bar (shown only on wider screens) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-5xl mb-2 px-4 py-1.5 text-xs text-amber-200/80">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-amber-100">Android Mobile POS Simulator</span>
          <span className="text-amber-400/40">•</span>
          <span className="text-amber-300/70">Google Pixel 8 Pro / Galaxy S24 Ultra Profile</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviceMode(deviceMode === 'mobile-frame' ? 'responsive' : 'mobile-frame')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-200 hover:bg-amber-900/40 hover:text-white transition-colors"
          >
            {deviceMode === 'mobile-frame' ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand to Fullscreen POS</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Mobile Device Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container: Either Styled Android Device or Responsive Wide Canvas */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col overflow-hidden ${
          deviceMode === 'mobile-frame'
            ? 'max-w-[430px] h-[100dvh] md:h-[900px] md:max-h-[92vh] md:rounded-[44px] md:border-[10px] md:border-[#201511] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_2px_rgba(212,163,115,0.25)]'
            : 'max-w-7xl h-[100dvh] md:h-[94vh] md:rounded-2xl md:border md:border-amber-900/40 md:shadow-2xl'
        } bg-[#180d08] text-stone-100`}
      >
        {/* Android Status Bar */}
        <div className="shrink-0 h-10 px-6 flex items-center justify-between text-xs text-amber-100/90 font-medium z-30 select-none bg-gradient-to-b from-[#140b07] to-transparent">
          {/* Time */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tight">{currentTime}</span>
          </div>

          {/* Camera Notch / Punch hole (centered) */}
          <div className="w-4 h-4 rounded-full bg-black/90 border border-neutral-800/80 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0d1624]" />
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-amber-300">5G</span>
            <Wifi className="w-3.5 h-3.5 text-amber-200" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono">98%</span>
              <BatteryMedium className="w-4 h-4 text-amber-300" />
            </div>
          </div>
        </div>

        {/* Dynamic App Content Body */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Android Gesture Pill / Navigation Indicator */}
        <div className="shrink-0 h-4 flex items-center justify-center bg-[#150c07] pb-1 z-30">
          <div className="w-32 h-1 rounded-full bg-amber-400/30" />
        </div>
      </div>
    </div>
  );
};
