import React, { useState } from 'react';
import {
  Store,
  Receipt,
  Download,
  Upload,
  RotateCcw,
  Boxes,
  Users,
  Smartphone,
  CheckCircle,
  HelpCircle,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const SettingsScreen: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetAllData,
    exportDatabaseJSON,
    importDatabaseJSON,
    theme,
    toggleTheme,
    setActiveTab,
    logout,
    user,
  } = useApp();

  const { isInstallable, install } = usePWAInstall();

  // Local form state
  const [shopName, setShopName] = useState(settings.shopName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [gstin, setGstin] = useState(settings.gstin);
  const [gstRate, setGstRate] = useState(settings.gstRate);
  const [dailySalesTarget, setDailySalesTarget] = useState(settings.dailySalesTarget || 2500);
  const [upiId, setUpiId] = useState(settings.upiId);
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>(settings.printerPaperWidth);

  const [savedNotice, setSavedNotice] = useState(false);
  const [importNotice, setImportNotice] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      shopName,
      tagline,
      address,
      phone,
      gstin,
      gstRate: Number(gstRate),
      dailySalesTarget: Number(dailySalesTarget),
      upiId,
      printerPaperWidth: paperWidth,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CoffeeShop_POS_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDatabaseJSON(content);
        if (success) {
          setImportNotice('Database restored successfully from backup!');
        } else {
          setImportNotice('Invalid backup file. Please upload a valid JSON backup.');
        }
        setTimeout(() => setImportNotice(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden text-stone-100">
      {/* Settings Header */}
      <div className="shrink-0 p-3.5 bg-[#1e1009] border-b border-amber-900/30">
        <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
          Configuration & More
        </span>
        <h2 className="text-base font-bold text-white font-heading">
          Store & POS Settings
        </h2>
      </div>

      {/* Settings Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Quick Nav shortcuts to Inventory and Customers */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className="p-3 rounded-2xl bg-[#23120b] border border-amber-900/40 hover:border-amber-600/50 flex items-center gap-3 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Inventory</h4>
              <p className="text-[10px] text-amber-300/60">Stock & Ingredients</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className="p-3 rounded-2xl bg-[#23120b] border border-amber-900/40 hover:border-amber-600/50 flex items-center gap-3 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Customers</h4>
              <p className="text-[10px] text-amber-300/60">Loyalty & Phonebook</p>
            </div>
          </button>
        </div>

        {/* Android PWA / APK Guide */}
        <div className="p-4 rounded-2xl bg-[#20110a] border border-amber-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Android App Installation
              </h3>
            </div>
            {isInstallable && (
              <button
                onClick={install}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
              >
                Install Now
              </button>
            )}
          </div>
          <p className="text-xs text-amber-200/70 leading-relaxed">
            This POS app is fully PWA enabled and works 100% offline. On Android, tap the browser menu (⋮) and select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong> to run it in full-screen standalone mode with no browser URL bar.
          </p>
        </div>

        {/* Shop Configuration Form */}
        <form onSubmit={handleSaveSettings} className="p-4 rounded-2xl bg-[#20110a] border border-amber-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-4 h-4 text-amber-400" />
              Store Information
            </h3>
            {savedNotice && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
              Shop Name
            </label>
            <input
              type="text"
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                Store Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                GSTIN Number
              </label>
              <input
                type="text"
                value={gstin}
                onChange={e => setGstin(e.target.value)}
                className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
              Store Address
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                GST Rate (%)
              </label>
              <input
                type="number"
                value={gstRate}
                onChange={e => setGstRate(Number(e.target.value))}
                className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                Printer Paper Format
              </label>
              <select
                value={paperWidth}
                onChange={e => setPaperWidth(e.target.value as '58mm' | '80mm')}
                className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="80mm">80mm Standard POS</option>
                <option value="58mm">58mm Compact POS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
              Daily Sales Target ({settings.currencySymbol})
            </label>
            <input
              type="number"
              value={dailySalesTarget}
              onChange={e => setDailySalesTarget(Number(e.target.value))}
              className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              placeholder="2500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
              Store UPI ID (for QR Generation)
            </label>
            <input
              type="text"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            Update Shop Settings
          </button>
        </form>

        {/* Database Backup & Restore */}
        <div className="p-4 rounded-2xl bg-[#20110a] border border-amber-900/40 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Download className="w-4 h-4 text-amber-400" />
            Backup & Data Persistence
          </h3>
          <p className="text-xs text-amber-200/70">
            Export a full JSON backup of products, orders, customers, and inventory to your device, or restore from a previous backup.
          </p>

          {importNotice && (
            <div className="p-2.5 rounded-xl bg-amber-950 border border-amber-700/60 text-xs text-amber-200">
              {importNotice}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadBackup}
              className="py-2.5 px-3 rounded-xl bg-[#140b07] hover:bg-[#1f110a] border border-amber-900/60 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Backup</span>
            </button>

            <label className="py-2.5 px-3 rounded-xl bg-[#140b07] hover:bg-[#1f110a] border border-amber-900/60 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
              <Upload className="w-3.5 h-3.5" />
              <span>Restore JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to factory coffee shop defaults?')) {
                resetAllData();
              }
            }}
            className="w-full py-2 rounded-xl text-red-400/80 hover:text-red-300 hover:bg-red-950/30 text-xs flex items-center justify-center gap-1.5 transition-colors border border-red-900/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Demo Data Defaults</span>
          </button>
        </div>

        {/* User Session & Logout */}
        <div className="p-3.5 rounded-2xl bg-[#20110a] border border-amber-900/40 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white">{user.name}</span>
            <p className="text-[11px] text-amber-300/60">{user.email} • {user.role}</p>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-800/40 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
