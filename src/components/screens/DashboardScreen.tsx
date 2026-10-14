import React from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  UtensilsCrossed,
  ArrowRight,
  Boxes,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardScreen: React.FC = () => {
  const {
    orders,
    customers,
    products,
    inventory,
    settings,
    updateSettings,
    setActiveTab,
    setIsCartOpen,
    setActiveOrderForReceipt,
  } = useApp();

  // Daily Sales Target logic
  const dailyTarget = settings.dailySalesTarget || 2500;

  // Calculate Today's metrics (orders from today)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.timestamp.startsWith(todayStr) && o.orderStatus === 'Completed');

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrdersCount = todayOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(todayRevenue / totalOrdersCount) : 0;
  // Estimated gross profit (~68% margin for coffee & bakery)
  const estimatedProfit = Math.round(todayRevenue * 0.68);

  const targetProgressPct = Math.round((todayRevenue / dailyTarget) * 100);
  const targetRemaining = Math.max(0, dailyTarget - todayRevenue);

  // Identify low-stock items
  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert);
  const lowStockIngredients = inventory.filter(i => i.quantity <= i.minThreshold);
  const totalLowStockCount = lowStockProducts.length + lowStockIngredients.length;

  // Best-selling products calculation
  const productSalesMap: Record<string, { name: string; qty: number; revenue: number; image: string }> = {};
  orders.forEach(o => {
    if (o.orderStatus === 'Completed') {
      o.items.forEach(item => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.name,
            qty: 0,
            revenue: 0,
            image: item.image,
          };
        }
        productSalesMap[item.productId].qty += item.quantity;
        productSalesMap[item.productId].revenue += item.itemTotal;
      });
    }
  });

  const topSellers = Object.values(productSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-stone-100">
      {/* Welcome Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#3e2316] via-[#2d1810] to-[#20100a] border border-amber-800/40 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Store Pulse
              </span>
              <h2 className="text-xl font-extrabold text-white font-heading mt-0.5">
                Today's Overview
              </h2>
            </div>
            <button
              onClick={() => {
                setActiveTab('menu');
                setIsCartOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>New Bill</span>
            </button>
          </div>
          <p className="text-xs text-amber-200/70 mt-1">
            Real-time sales, order tickets, and inventory status.
          </p>
        </div>
      </div>

      {/* Low-stock Notification Alert */}
      {totalLowStockCount > 0 && (
        <div
          onClick={() => setActiveTab('inventory')}
          className="p-3 rounded-xl bg-amber-950/70 border border-amber-600/50 flex items-center justify-between text-amber-200 cursor-pointer hover:bg-amber-950 transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-amber-300">
                Low Stock Alert ({totalLowStockCount} items)
              </h4>
              <p className="text-[11px] text-amber-200/70 truncate">
                {lowStockProducts.map(p => p.name).concat(lowStockIngredients.map(i => i.name)).join(', ')}
              </p>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-semibold shrink-0 ml-2">
            Restock →
          </span>
        </div>
      )}

      {/* Real-Time Daily Sales Target Progress Card */}
      <div className="p-4 rounded-2xl bg-[#23120b] border border-amber-900/50 shadow-md space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Daily Sales Target
                </h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold">
                  {targetProgressPct}%
                </span>
              </div>
              <p className="text-[11px] text-amber-200/60">
                {targetRemaining > 0 ? (
                  <span>{settings.currencySymbol}{targetRemaining.toLocaleString('en-IN')} remaining to reach target</span>
                ) : (
                  <span className="text-emerald-400 font-semibold">Goal Achieved! Fantastic work today!</span>
                )}
              </p>
            </div>
          </div>

          {/* Target Value & Quick Edit */}
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-white">
              <span className="text-amber-400 font-extrabold">{settings.currencySymbol}{todayRevenue.toLocaleString('en-IN')}</span>
              <span className="text-amber-200/50"> / {settings.currencySymbol}{dailyTarget.toLocaleString('en-IN')}</span>
            </div>
            <button
              onClick={() => {
                const newTarget = window.prompt('Set new Daily Sales Target in ₹:', dailyTarget.toString());
                if (newTarget && !isNaN(Number(newTarget)) && Number(newTarget) > 0) {
                  updateSettings({ dailySalesTarget: Number(newTarget) });
                }
              }}
              className="text-[10px] text-amber-400/80 hover:text-amber-300 underline font-medium mt-0.5"
            >
              Adjust Target
            </button>
          </div>
        </div>

        {/* Progress Bar with smooth animated transition */}
        <div className="w-full h-3 rounded-full bg-[#130a06] p-0.5 border border-amber-900/40 overflow-hidden relative">
          <div
            style={{ width: `${Math.min(100, targetProgressPct)}%` }}
            className={`h-full rounded-full transition-all duration-500 ease-out shadow-sm ${
              targetProgressPct >= 100
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-emerald-500/30'
                : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-300 shadow-amber-500/20'
            }`}
          />
        </div>

        {/* Target Milestone Indicators */}
        <div className="flex justify-between text-[10px] font-mono text-amber-200/40 px-0.5">
          <span>{settings.currencySymbol}0</span>
          <span>{settings.currencySymbol}{Math.round(dailyTarget * 0.5)} (50%)</span>
          <span className={targetProgressPct >= 100 ? 'text-emerald-400 font-bold' : ''}>
            {settings.currencySymbol}{dailyTarget} (100%)
          </span>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Today's Sales */}
        <div className="p-3.5 rounded-2xl bg-[#23120b] border border-amber-900/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-semibold text-amber-200/70">Today's Sales</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
              {settings.currencySymbol}{todayRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
              Avg {settings.currencySymbol}{avgOrderValue} / bill
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-3.5 rounded-2xl bg-[#23120b] border border-amber-900/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-semibold text-amber-200/70">Total Orders</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
              {totalOrdersCount}
            </div>
            <div className="text-[10px] text-amber-300/70 font-medium mt-0.5">
              All settled & paid
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="p-3.5 rounded-2xl bg-[#23120b] border border-amber-900/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-semibold text-amber-200/70">Total Customers</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
              {customers.length}
            </div>
            <div className="text-[10px] text-amber-300/70 font-medium mt-0.5">
              Enrolled in loyalty
            </div>
          </div>
        </div>

        {/* Net Profit Summary */}
        <div className="p-3.5 rounded-2xl bg-[#23120b] border border-amber-900/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-semibold text-amber-200/70">Est. Profit (68%)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400 tracking-tight">
              {settings.currencySymbol}{estimatedProfit.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-300/70 font-medium mt-0.5">
              Net cafe margin
            </div>
          </div>
        </div>
      </div>

      {/* Quick POS Navigation Grid */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab('menu')}
          className="p-3 rounded-xl bg-[#23120b] border border-amber-900/40 hover:border-amber-600/40 flex flex-col items-center text-center transition-colors"
        >
          <UtensilsCrossed className="w-5 h-5 text-amber-400 mb-1" />
          <span className="text-xs font-bold text-white">Menu POS</span>
          <span className="text-[10px] text-amber-300/60 mt-0.5">{products.length} Products</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className="p-3 rounded-xl bg-[#23120b] border border-amber-900/40 hover:border-amber-600/40 flex flex-col items-center text-center transition-colors"
        >
          <Boxes className="w-5 h-5 text-amber-400 mb-1" />
          <span className="text-xs font-bold text-white">Inventory</span>
          <span className="text-[10px] text-amber-300/60 mt-0.5">{inventory.length} Stock items</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className="p-3 rounded-xl bg-[#23120b] border border-amber-900/40 hover:border-amber-600/40 flex flex-col items-center text-center transition-colors"
        >
          <FileText className="w-5 h-5 text-amber-400 mb-1" />
          <span className="text-xs font-bold text-white">Reports</span>
          <span className="text-[10px] text-amber-300/60 mt-0.5">Export CSV</span>
        </button>
      </div>

      {/* Best-Selling Coffee Items */}
      <div className="p-4 rounded-2xl bg-[#20110a] border border-amber-900/40">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Top Selling Items
          </h3>
          <button
            onClick={() => setActiveTab('menu')}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
          >
            All Menu <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {topSellers.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-[#170c07] border border-amber-900/20"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover bg-amber-950 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                  <span className="text-[10px] text-amber-300/60 font-mono">
                    {item.qty} cups sold
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold font-mono text-amber-400">
                  {settings.currencySymbol}{item.revenue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="p-4 rounded-2xl bg-[#20110a] border border-amber-900/40">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Recent Orders
          </h3>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
          >
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {orders.slice(0, 3).map(order => (
            <div
              key={order.id}
              onClick={() => setActiveOrderForReceipt(order)}
              className="p-3 rounded-xl bg-[#170c07] border border-amber-900/20 hover:border-amber-700/50 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">
                    {order.invoiceNumber}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 border border-amber-800/40 text-amber-300">
                    {order.orderType}
                  </span>
                </div>
                <div className="text-[11px] text-amber-300/60 mt-0.5">
                  {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold font-mono text-amber-400">
                  {settings.currencySymbol}{order.grandTotal}
                </div>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
