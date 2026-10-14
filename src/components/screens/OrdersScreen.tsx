import React, { useState } from 'react';
import { Search, Printer, CheckCircle, Clock, XCircle, ChevronRight, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

export const OrdersScreen: React.FC = () => {
  const { orders, setActiveOrderForReceipt, settings, cancelOrder } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    const matchesSearch =
      order.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.customerPhone && order.customerPhone.includes(searchQuery));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden text-stone-100">
      {/* Search and Status Filters */}
      <div className="shrink-0 p-3 bg-[#1e1009] border-b border-amber-900/30 space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-amber-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Invoice # or Customer Phone..."
            className="w-full bg-[#140b07] border border-amber-900/50 rounded-xl py-2 pl-9 pr-3 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="grid grid-cols-4 p-1 bg-[#140b07] rounded-xl border border-amber-900/40">
          {(['All', 'Completed', 'Pending', 'Cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === tab
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-amber-200/60 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-amber-300/50">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold">No orders found</p>
            <p className="text-xs text-amber-200/50 mt-1">
              Try a different search query or status filter.
            </p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const dateStr = new Date(order.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                onClick={() => setActiveOrderForReceipt(order)}
                className="p-3.5 rounded-2xl bg-[#23120b] border border-amber-900/40 hover:border-amber-600/50 cursor-pointer transition-all shadow-sm flex flex-col gap-2"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">
                      {order.invoiceNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-800/40 text-amber-300 font-medium">
                      {order.orderType}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1">
                    {order.orderStatus === 'Completed' ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : order.orderStatus === 'Pending' ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-red-400">
                        <XCircle className="w-3.5 h-3.5" />
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* Items & Customer summary */}
                <div className="text-xs text-amber-200/75">
                  <p className="line-clamp-1">
                    {order.items
                      .map(i => `${i.name} (${i.selectedSize}) x${i.quantity}`)
                      .join(' • ')}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-amber-400/60 mt-1">
                    <span>{order.customerName || 'Walk-in'}</span>
                    <span>•</span>
                    <span>{dateStr}</span>
                    <span>•</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>

                {/* Footer with Grand Total & Print Button */}
                <div className="pt-2 border-t border-amber-900/30 flex items-center justify-between">
                  <div className="text-sm font-extrabold font-mono text-amber-400">
                    {settings.currencySymbol}{order.grandTotal}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {order.orderStatus !== 'Cancelled' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          cancelOrder(order.id);
                        }}
                        className="px-2 py-1 rounded-lg text-[10px] text-red-400/70 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setActiveOrderForReceipt(order);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
