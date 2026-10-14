import React from 'react';
import { Home, ClipboardList, UtensilsCrossed, BarChart3, MoreHorizontal, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, cart, setIsCartOpen, cartGrandTotal, settings } = useApp();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'dashboard' as const, label: 'Home', icon: Home },
    { id: 'orders' as const, label: 'Orders', icon: ClipboardList },
    { id: 'menu' as const, label: 'Menu', icon: UtensilsCrossed },
    { id: 'reports' as const, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as const, label: 'More', icon: MoreHorizontal },
  ];

  return (
    <div className="relative shrink-0 z-40">
      {/* Floating Cart Summary Bar if cart has items */}
      {totalCartItems > 0 && (
        <div className="px-3 pb-2 pt-1">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-stone-950 font-bold text-sm shadow-xl shadow-black/50 flex items-center justify-between active:scale-[0.99] transition-transform animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-stone-950/20 flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5 text-stone-950" />
              </div>
              <span className="text-xs font-semibold">
                {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'} in Order
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-extrabold">
                {settings.currencySymbol}{cartGrandTotal}
              </span>
              <span className="text-xs bg-stone-950/20 px-2 py-0.5 rounded text-stone-950 font-medium">
                View Bill →
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Main 5-Destination Android Bottom Navigation Bar */}
      <nav className="h-16 bg-[#1a0e08]/95 backdrop-blur-lg border-t border-amber-900/40 grid grid-cols-5 items-center px-1">
        {navItems.map(item => {
          const isActive =
            activeTab === item.id ||
            (item.id === 'settings' && (activeTab === 'inventory' || activeTab === 'customers'));
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center h-full transition-colors relative ${
                isActive ? 'text-amber-400' : 'text-amber-200/50 hover:text-amber-200/80'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-amber-500/15 scale-105' : ''
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap ${
                  isActive ? 'font-bold text-amber-300' : ''
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
