import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, User, ArrowRight, Tag, Percent } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderType } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartItemQty,
    removeFromCart,
    clearCart,
    discountPercentage,
    setDiscountPercentage,
    orderMeta,
    setOrderMeta,
    cartSubtotal,
    cartDiscountAmount,
    cartGstAmount,
    cartGrandTotal,
    settings,
    setIsCheckoutOpen,
    customers,
  } = useApp();

  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  if (!isCartOpen) return null;

  const orderTypes: OrderType[] = ['Dine-in', 'Takeaway', 'Delivery'];
  const discountOptions = [0, 5, 10, 15, 20];

  const handleSelectCustomer = (c: { name: string; phone: string }) => {
    setOrderMeta(prev => ({
      ...prev,
      customerName: c.name,
      customerPhone: c.phone,
    }));
    setShowCustomerDropdown(false);
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) return;
    setIsCheckoutOpen(true);
  };

  const matchingCustomers = customers.filter(
    c =>
      c.phone.includes(customerSearch) ||
      c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1a0e08] h-full flex flex-col shadow-2xl border-l border-amber-900/40 text-stone-100">
        {/* Top Header */}
        <div className="shrink-0 h-14 px-4 bg-[#23120b] border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white font-heading">
              Current Order ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                title="Clear Cart"
                className="p-2 text-red-400/80 hover:text-red-300 text-xs rounded-lg hover:bg-red-950/40 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-amber-950/40 text-amber-200 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Order Details & Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Order Type Selector */}
          <div className="grid grid-cols-3 p-1 bg-[#130b06] rounded-xl border border-amber-900/50">
            {orderTypes.map(type => (
              <button
                key={type}
                onClick={() => setOrderMeta(prev => ({ ...prev, orderType: type }))}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  orderMeta.orderType === type
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-amber-200/60 hover:text-amber-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Customer & Table Inputs */}
          <div className="p-3 rounded-xl bg-[#23120b]/80 border border-amber-900/40 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-200/80">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Customer & Table Details
              </span>
              <span className="text-[10px] text-amber-400/80 font-normal">Optional</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="tel"
                  value={orderMeta.customerPhone}
                  onChange={e => {
                    const val = e.target.value;
                    setOrderMeta(prev => ({ ...prev, customerPhone: val }));
                    setCustomerSearch(val);
                    setShowCustomerDropdown(val.length > 1);
                  }}
                  placeholder="Phone (10 digits)"
                  className="w-full bg-[#150b06] border border-amber-900/50 rounded-lg px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                />
                {showCustomerDropdown && matchingCustomers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#25130b] border border-amber-800/80 rounded-lg shadow-xl z-20 max-h-36 overflow-y-auto">
                    {matchingCustomers.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCustomer(c)}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-amber-900/50 border-b border-amber-900/30 text-amber-100 flex items-center justify-between"
                      >
                        <span className="font-semibold">{c.name}</span>
                        <span className="text-[10px] font-mono text-amber-400">{c.phone}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                value={orderMeta.customerName}
                onChange={e => setOrderMeta(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Customer Name"
                className="w-full bg-[#150b06] border border-amber-900/50 rounded-lg px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            {orderMeta.orderType === 'Dine-in' && (
              <input
                type="text"
                value={orderMeta.tableNumber}
                onChange={e => setOrderMeta(prev => ({ ...prev, tableNumber: e.target.value }))}
                placeholder="Table No. (e.g. Table 4)"
                className="w-full bg-[#150b06] border border-amber-900/50 rounded-lg px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />
            )}
          </div>

          {/* Cart Items List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-200/90 uppercase tracking-wider">
                Order Items
              </span>
              <span className="text-[11px] text-amber-400 font-mono">
                {cart.length} distinct items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-amber-300/50">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">Cart is currently empty</p>
                <p className="text-xs mt-1">Tap items in the menu to add to this order</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#23120b] border border-amber-900/30 flex items-start gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-amber-950 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-amber-400/50 hover:text-red-400 p-0.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-amber-300/70 mt-0.5">
                        <span>{item.selectedSize}</span>
                        {item.selectedAddOns.length > 0 && (
                          <span className="text-amber-400/90 ml-1">
                            +{item.selectedAddOns.map(a => a.name).join(', ')}
                          </span>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-[10px] text-amber-400/80 italic mt-0.5">
                          "{item.notes}"
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-[#150b06] border border-amber-900/50 rounded-lg p-0.5">
                          <button
                            onClick={() => updateCartItemQty(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-amber-200 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-xs text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItemQty(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-amber-200 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold font-mono text-amber-400">
                            {settings.currencySymbol}{item.itemTotal}
                          </span>
                          <span className="text-[10px] text-amber-200/50 block font-mono">
                            @{settings.currencySymbol}{item.unitPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Discount Section */}
          {cart.length > 0 && (
            <div className="p-3 rounded-xl bg-[#23120b]/80 border border-amber-900/40">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-200/90">
                  <Percent className="w-3.5 h-3.5 text-amber-400" />
                  Order Discount
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {discountPercentage}% off
                </span>
              </div>
              <div className="flex gap-1.5">
                {discountOptions.map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPercentage(pct)}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg border transition-all ${
                      discountPercentage === pct
                        ? 'bg-amber-500 border-amber-400 text-stone-950 font-bold'
                        : 'bg-[#150b06] border-amber-900/40 text-amber-200/70 hover:border-amber-700/50'
                    }`}
                  >
                    {pct === 0 ? 'None' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bill Calculations & Checkout Footer */}
        {cart.length > 0 && (
          <div className="shrink-0 p-4 bg-[#140b07] border-t border-amber-900/50 space-y-3">
            <div className="space-y-1.5 text-xs text-amber-200/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-white">
                  {settings.currencySymbol}{cartSubtotal}
                </span>
              </div>

              {discountPercentage > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({discountPercentage}%)</span>
                  <span className="font-mono font-semibold">
                    -{settings.currencySymbol}{cartDiscountAmount}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-amber-300/70">
                <span>GST ({settings.gstRate}% Restaurant Tax)</span>
                <span className="font-mono font-semibold">
                  {settings.currencySymbol}{cartGstAmount}
                </span>
              </div>

              <div className="pt-2 border-t border-amber-900/50 flex justify-between items-baseline text-base font-extrabold text-white">
                <span className="font-heading">Grand Total</span>
                <span className="font-mono text-xl text-amber-400">
                  {settings.currencySymbol}{cartGrandTotal}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-950/80 active:scale-[0.98] transition-all flex items-center justify-between"
            >
              <span>Proceed to Payment</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-base font-extrabold">
                  {settings.currencySymbol}{cartGrandTotal}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
