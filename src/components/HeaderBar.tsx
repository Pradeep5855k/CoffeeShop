import React from 'react';
import { Coffee, Sun, Moon, ShoppingBag, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const HeaderBar: React.FC = () => {
  const { settings, theme, toggleTheme, user, cart, setIsCartOpen } = useApp();
  const { isInstallable, install } = usePWAInstall();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="shrink-0 h-14 px-4 bg-[#1f110a]/90 backdrop-blur-md border-b border-amber-900/30 flex items-center justify-between z-30">
      {/* Brand Wordmark & Cashier */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 flex items-center justify-center shrink-0 shadow-sm">
          <div className="w-full h-full bg-[#20100a] rounded-[10px] flex items-center justify-center">
            <Coffee className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-white truncate font-heading leading-tight">
            {settings.shopName}
          </h1>
          <div className="flex items-center gap-1.5 text-[10px] text-amber-300/70">
            <span className="truncate">{user.name}</span>
            <span>•</span>
            <span className="uppercase text-[9px] tracking-wide text-amber-400 font-semibold">{user.role}</span>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* PWA Install Button if available */}
        {isInstallable && (
          <button
            onClick={install}
            title="Install POS App on Android"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-8 h-8 rounded-xl bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/40 flex items-center justify-center text-amber-300 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Quick Cart Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-md hover:bg-amber-400 transition-colors active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-600 text-white font-mono text-[10px] font-bold flex items-center justify-center px-1 border-2 border-[#180d08]">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
