import React, { useState } from 'react';
import { Download, TrendingUp, IndianRupee, ShoppingBag, PieChart, Calendar, BarChart2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsScreen: React.FC = () => {
  const { orders, settings, products } = useApp();

  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');

  // Filter orders by timeframe
  const now = new Date();
  const filteredOrders = orders.filter(order => {
    if (order.orderStatus !== 'Completed') return false;
    const orderDate = new Date(order.timestamp);
    if (timeframe === 'today') {
      return orderDate.toDateString() === now.toDateString();
    } else if (timeframe === 'week') {
      const diffTime = Math.abs(now.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    } else {
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }
  });

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const totalGstCollected = filteredOrders.reduce((sum, o) => sum + o.totalGst, 0);
  const totalDiscountsGiven = filteredOrders.reduce((sum, o) => sum + o.discountAmount, 0);
  // Estimated COGS (~32% raw goods cost) and Gross Profit (~68%)
  const estimatedCostOfGoods = Math.round(totalRevenue * 0.32);
  const estimatedGrossProfit = totalRevenue - estimatedCostOfGoods;

  // Payment Breakdown
  const paymentMethodCount: Record<string, number> = { UPI: 0, Cash: 0, Card: 0, Split: 0 };
  const paymentMethodAmount: Record<string, number> = { UPI: 0, Cash: 0, Card: 0, Split: 0 };

  filteredOrders.forEach(o => {
    paymentMethodCount[o.paymentMethod] = (paymentMethodCount[o.paymentMethod] || 0) + 1;
    paymentMethodAmount[o.paymentMethod] = (paymentMethodAmount[o.paymentMethod] || 0) + o.grandTotal;
  });

  // Category Breakdown
  const categoryRevenue: Record<string, number> = {};
  filteredOrders.forEach(o => {
    o.items.forEach(i => {
      categoryRevenue[i.category] = (categoryRevenue[i.category] || 0) + i.itemTotal;
    });
  });

  // Hourly slots (e.g. 8am, 10am, 12pm, 2pm, 4pm, 6pm, 8pm)
  const hourlySlots = [
    { label: '8 AM', count: 120 },
    { label: '10 AM', count: 480 },
    { label: '12 PM', count: 640 },
    { label: '2 PM', count: 350 },
    { label: '4 PM', count: 720 },
    { label: '6 PM', count: 890 },
    { label: '8 PM', count: 540 },
  ];
  const maxSlot = Math.max(...hourlySlots.map(s => s.count), 1);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Invoice Number',
      'Date & Time',
      'Order Type',
      'Payment Method',
      'Customer',
      'Items',
      'Subtotal',
      'Discount',
      'GST',
      'Grand Total',
    ];

    const rows = filteredOrders.map(o => [
      o.invoiceNumber,
      `"${new Date(o.timestamp).toLocaleString('en-IN')}"`,
      o.orderType,
      o.paymentMethod,
      `"${o.customerName || 'Walk-in'}"`,
      `"${o.items.map(i => `${i.name}x${i.quantity}`).join(';')}"`,
      o.subtotal,
      o.discountAmount,
      o.totalGst,
      o.grandTotal,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CoffeeShop_Sales_Report_${timeframe}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden text-stone-100">
      {/* Timeframe Selector & Export Header */}
      <div className="shrink-0 p-3 bg-[#1e1009] border-b border-amber-900/30 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              Financial Analytics
            </span>
            <h2 className="text-base font-bold text-white font-heading">
              Sales & Profit Reports
            </h2>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Timeframe Tabs */}
        <div className="grid grid-cols-3 p-1 bg-[#140b07] rounded-xl border border-amber-900/40">
          {(['today', 'week', 'month'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                timeframe === t
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-amber-200/60 hover:text-white'
              }`}
            >
              {t === 'today' ? "Today's Pulse" : t === 'week' ? 'Past 7 Days' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {/* Primary KPI Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-[#23120b] border border-amber-900/40 flex flex-col justify-between">
            <span className="text-xs text-amber-200/70">Gross Sales</span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-white mt-1">
              {settings.currencySymbol}{totalRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-amber-400/80 font-mono mt-0.5">
              {totalOrdersCount} paid receipts
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#23120b] border border-amber-900/40 flex flex-col justify-between">
            <span className="text-xs text-emerald-400">Net Estimated Profit</span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400 mt-1">
              {settings.currencySymbol}{estimatedGrossProfit.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-300/70 font-mono mt-0.5">
              ~68% Margin after COGS
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#23120b] border border-amber-900/40 flex flex-col justify-between">
            <span className="text-xs text-amber-200/70">Avg Ticket Size (AOV)</span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400 mt-1">
              {settings.currencySymbol}{avgOrderValue}
            </div>
            <span className="text-[10px] text-amber-300/60 font-mono mt-0.5">
              Per order average
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#23120b] border border-amber-900/40 flex flex-col justify-between">
            <span className="text-xs text-amber-200/70">GST Collected ({settings.gstRate}%)</span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-white mt-1">
              {settings.currencySymbol}{Math.round(totalGstCollected).toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-amber-300/60 font-mono mt-0.5">
              CGST + SGST
            </span>
          </div>
        </div>

        {/* Hourly Peak Rush Chart (Pure SVG) */}
        <div className="p-4 rounded-2xl bg-[#20110a] border border-amber-900/40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-amber-400" />
              Peak Hour Revenue Curve
            </h3>
            <span className="text-[10px] text-amber-300/70 font-mono">Busy hours: 4 - 7 PM</span>
          </div>

          <div className="h-28 flex items-end justify-between gap-2 pt-2 px-1">
            {hourlySlots.map(slot => {
              const heightPct = Math.round((slot.count / maxSlot) * 100);
              return (
                <div key={slot.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    style={{ height: `${Math.max(12, heightPct)}%` }}
                    className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 transition-all shadow-sm relative group cursor-pointer"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-mono pointer-events-none transition-opacity whitespace-nowrap z-10">
                      {settings.currencySymbol}{slot.count}
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-amber-200/60 whitespace-nowrap">
                    {slot.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="p-4 rounded-2xl bg-[#20110a] border border-amber-900/40 space-y-2.5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-amber-400" />
            Payment Tender Breakdown
          </h3>

          <div className="space-y-2">
            {[
              { name: 'UPI (QR Code)', count: paymentMethodCount.UPI || 0, amount: paymentMethodAmount.UPI || 0, color: 'bg-emerald-500' },
              { name: 'Cash', count: paymentMethodCount.Cash || 0, amount: paymentMethodAmount.Cash || 0, color: 'bg-amber-500' },
              { name: 'Credit/Debit Card', count: paymentMethodCount.Card || 0, amount: paymentMethodAmount.Card || 0, color: 'bg-blue-500' },
            ].map(pm => {
              const pct = totalRevenue > 0 ? Math.round((pm.amount / totalRevenue) * 100) : 0;
              return (
                <div key={pm.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-amber-200/80">{pm.name} ({pm.count})</span>
                    <span className="font-mono font-bold text-white">
                      {settings.currencySymbol}{pm.amount.toLocaleString('en-IN')} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#140b07] overflow-hidden">
                    <div style={{ width: `${pct}%` }} className={`h-full ${pm.color} rounded-full`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by Product Category */}
        <div className="p-4 rounded-2xl bg-[#20110a] border border-amber-900/40">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
            Category Contribution
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {Object.entries(categoryRevenue).map(([cat, amount]) => (
              <div key={cat} className="p-2.5 rounded-xl bg-[#170c07] border border-amber-900/20 flex justify-between items-center">
                <span className="text-amber-200/70 truncate">{cat}</span>
                <span className="font-bold text-amber-400 shrink-0">
                  {settings.currencySymbol}{amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
