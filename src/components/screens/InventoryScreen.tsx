import React, { useState } from 'react';
import { Boxes, AlertTriangle, Plus, RefreshCw, CheckCircle, PackageCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';

export const InventoryScreen: React.FC = () => {
  const { inventory, products, restockItem, updateProduct, settings } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'low-stock' | 'ingredients' | 'products'>('all');
  const [restockModalItem, setRestockModalItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);
  const [restockCost, setRestockCost] = useState<number>(0);

  // Low stock items
  const lowStockIngredients = inventory.filter(i => i.quantity <= i.minThreshold);
  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert);

  // Valuation of inventory
  const totalIngredientValue = inventory.reduce((sum, item) => sum + item.quantity * item.costPerUnit, 0);

  const handleOpenRestock = (item: InventoryItem) => {
    setRestockModalItem(item);
    setRestockQty(10);
    setRestockCost(item.costPerUnit);
  };

  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalItem || restockQty <= 0) return;
    restockItem(restockModalItem.id, restockQty, restockCost);
    setRestockModalItem(null);
  };

  const handleQuickAddProductStock = (productId: string, currentStock: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    updateProduct({ ...prod, stock: currentStock + 10 });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden text-stone-100">
      {/* Top Inventory Summary Banner */}
      <div className="shrink-0 p-3 bg-[#1e1009] border-b border-amber-900/30 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              Stock & Supply Chain
            </span>
            <h2 className="text-base font-bold text-white font-heading">
              Inventory Management
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-amber-300/70 block">Stock Valuation</span>
            <span className="text-sm font-mono font-extrabold text-amber-400">
              {settings.currencySymbol}{Math.round(totalIngredientValue).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="grid grid-cols-4 p-1 bg-[#140b07] rounded-xl border border-amber-900/40">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-amber-200/60 hover:text-white'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setActiveTab('low-stock')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'low-stock'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-amber-200/60 hover:text-white'
            }`}
          >
            <span>Alerts</span>
            {lowStockIngredients.length + lowStockProducts.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center font-bold">
                {lowStockIngredients.length + lowStockProducts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'ingredients'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-amber-200/60 hover:text-white'
            }`}
          >
            Raw Goods
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'products'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-amber-200/60 hover:text-white'
            }`}
          >
            Menu Stock
          </button>
        </div>
      </div>

      {/* Inventory Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* RAW INGREDIENTS & PACKAGING */}
        {(activeTab === 'all' || activeTab === 'ingredients' || activeTab === 'low-stock') && (
          <div>
            <h3 className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">
              Cafe Ingredients & Consumables
            </h3>
            <div className="space-y-2">
              {inventory
                .filter(i => (activeTab === 'low-stock' ? i.quantity <= i.minThreshold : true))
                .map(item => {
                  const isLow = item.quantity <= item.minThreshold;
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-[#23120b] border border-amber-900/40 flex items-center justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <span className="text-[10px] text-amber-300/60 px-1.5 py-0.2 rounded bg-amber-950 border border-amber-800/30">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-amber-200/70 mt-1 font-mono">
                          <span>
                            Cost: {settings.currencySymbol}{item.costPerUnit} / {item.unit}
                          </span>
                          <span>•</span>
                          <span>Min: {item.minThreshold} {item.unit}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div
                            className={`text-sm font-mono font-extrabold ${
                              isLow ? 'text-red-400' : 'text-amber-400'
                            }`}
                          >
                            {item.quantity} {item.unit}
                          </div>
                          {isLow && (
                            <span className="text-[10px] text-red-400 font-semibold flex items-center gap-0.5 justify-end">
                              <AlertTriangle className="w-2.5 h-2.5" /> Low
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleOpenRestock(item)}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-colors flex items-center gap-1 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Restock</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* MENU PRODUCT FINISHED STOCKS */}
        {(activeTab === 'all' || activeTab === 'products' || activeTab === 'low-stock') && (
          <div className="mt-4">
            <h3 className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">
              Finished Product Units (POS Stock)
            </h3>
            <div className="space-y-2">
              {products
                .filter(p => (activeTab === 'low-stock' ? p.stock <= p.minStockAlert : true))
                .map(prod => {
                  const isLow = prod.stock <= prod.minStockAlert;
                  return (
                    <div
                      key={prod.id}
                      className="p-3 rounded-2xl bg-[#23120b] border border-amber-900/40 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-amber-950 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                          <span className="text-[11px] text-amber-300/60 font-mono">
                            {settings.currencySymbol}{prod.price} • Alert under {prod.minStockAlert}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div
                            className={`text-sm font-mono font-extrabold ${
                              isLow ? 'text-red-400' : 'text-emerald-400'
                            }`}
                          >
                            {prod.stock} units
                          </div>
                          {isLow && (
                            <span className="text-[10px] text-red-400 font-semibold block">
                              Refill soon
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleQuickAddProductStock(prod.id, prod.stock)}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-colors flex items-center gap-1 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+10</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Restock Ingredient Modal */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#20110a] border border-amber-900/60 rounded-3xl p-5 shadow-2xl text-stone-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Restock Supply
                </span>
                <h3 className="text-base font-bold text-white font-heading">
                  {restockModalItem.name}
                </h3>
              </div>
              <button
                onClick={() => setRestockModalItem(null)}
                className="w-7 h-7 rounded-full bg-amber-950 text-amber-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmRestock} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                  Quantity to Add ({restockModalItem.unit})
                </label>
                <input
                  type="number"
                  step="any"
                  value={restockQty}
                  onChange={e => setRestockQty(Number(e.target.value))}
                  className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-base font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                  Purchase Cost per {restockModalItem.unit} ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  value={restockCost}
                  onChange={e => setRestockCost(Number(e.target.value))}
                  className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="p-3 bg-[#140b07] rounded-xl border border-amber-900/30 text-xs flex justify-between font-mono">
                <span className="text-amber-200/70">Total Restock Expense:</span>
                <span className="font-bold text-amber-400">
                  {settings.currencySymbol}{Math.round(restockQty * restockCost)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Restock</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
