import React, { useState } from 'react';
import { X, Banknote, QrCode, CreditCard, Split, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';

export const PaymentModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cartGrandTotal, settings, createOrder } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [cashTendered, setCashTendered] = useState<number>(cartGrandTotal);
  const [cardAuthNumber, setCardAuthNumber] = useState<string>('AUTH-' + Math.floor(100000 + Math.random() * 900000));
  const [splitCashAmount, setSplitCashAmount] = useState<number>(Math.floor(cartGrandTotal / 2));

  if (!isCheckoutOpen) return null;

  const cashChange = Math.max(0, cashTendered - cartGrandTotal);
  const cashShortage = Math.max(0, cartGrandTotal - cashTendered);
  const splitUpiAmount = Math.max(0, cartGrandTotal - splitCashAmount);

  // Quick cash denomination presets
  const cashPresets = [
    cartGrandTotal,
    Math.ceil(cartGrandTotal / 50) * 50,
    Math.ceil(cartGrandTotal / 100) * 100,
    500,
    1000,
  ].filter((v, i, arr) => v >= cartGrandTotal && arr.indexOf(v) === i);

  // Dynamic UPI URL for QR Code
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(
    settings.shopName
  )}&am=${cartGrandTotal}&cu=INR&tn=${encodeURIComponent('Coffee Shop POS Bill')}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    upiIntentUrl
  )}&color=2D1810&bgcolor=FAF7F2`;

  const handleCompleteOrder = () => {
    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4A373', '#FAF7F2', '#E0A96D', '#2D1810'],
      });
    } catch {
      // ignore
    }

    createOrder(paymentMethod, cashTendered, cashChange);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1d0f09] border border-amber-900/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-stone-100 max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-[#26130c] border-b border-amber-900/40 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
              Settlement & Billing
            </span>
            <h3 className="text-base font-bold text-white font-heading">
              Select Payment Method
            </h3>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-amber-950/50 text-amber-200 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-amber-600/20 border-b border-amber-900/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-200/80">Total Payable Amount</span>
            <div className="text-2xl font-extrabold font-mono text-amber-400">
              {settings.currencySymbol}{cartGrandTotal}
            </div>
          </div>
          <div className="text-right text-[11px] text-amber-300/70 font-mono">
            <span>Incl. {settings.gstRate}% GST</span>
          </div>
        </div>

        {/* Method Selector Tabs */}
        <div className="grid grid-cols-4 p-2 bg-[#140b07] border-b border-amber-900/40 gap-1.5">
          <button
            onClick={() => setPaymentMethod('UPI')}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
              paymentMethod === 'UPI'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-amber-200/60 hover:text-white hover:bg-amber-950/30'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span className="text-[11px]">UPI QR</span>
          </button>

          <button
            onClick={() => setPaymentMethod('Cash')}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
              paymentMethod === 'Cash'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-amber-200/60 hover:text-white hover:bg-amber-950/30'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span className="text-[11px]">Cash</span>
          </button>

          <button
            onClick={() => setPaymentMethod('Card')}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
              paymentMethod === 'Card'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-amber-200/60 hover:text-white hover:bg-amber-950/30'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-[11px]">Card POS</span>
          </button>

          <button
            onClick={() => setPaymentMethod('Split')}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
              paymentMethod === 'Split'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-amber-200/60 hover:text-white hover:bg-amber-950/30'
            }`}
          >
            <Split className="w-4 h-4" />
            <span className="text-[11px]">Split</span>
          </button>
        </div>

        {/* Dynamic Payment Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* UPI MODE */}
          {paymentMethod === 'UPI' && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-amber-400">
                <img
                  src={qrImageUrl}
                  alt="UPI QR Code"
                  className="w-44 h-44 object-contain rounded-lg"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  Scan to Pay via any UPI App
                </p>
                <p className="text-[11px] text-amber-300/70 mt-0.5">
                  Google Pay • PhonePe • Paytm • CRED • BHIM
                </p>
                <div className="mt-2 text-[10px] font-mono text-amber-400/90 bg-[#140b07] px-3 py-1 rounded-full border border-amber-900/40 inline-block">
                  UPI ID: {settings.upiId}
                </div>
              </div>
            </div>
          )}

          {/* CASH MODE */}
          {paymentMethod === 'Cash' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-200/90 mb-1.5">
                  Cash Received from Customer (₹)
                </label>
                <input
                  type="number"
                  value={cashTendered || ''}
                  onChange={e => setCashTendered(Number(e.target.value))}
                  className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-4 py-3 text-xl font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-400"
                  placeholder="0"
                />
              </div>

              {/* Quick Cash Presets */}
              <div>
                <span className="text-[10px] text-amber-300/60 uppercase tracking-wider block mb-1.5">
                  Quick Denominations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cashPresets.map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCashTendered(val)}
                      className={`py-1.5 px-3 rounded-lg border text-xs font-mono font-bold transition-all ${
                        cashTendered === val
                          ? 'bg-amber-500 border-amber-400 text-stone-950'
                          : 'bg-[#150b06] border-amber-900/40 text-amber-200/80 hover:border-amber-700'
                      }`}
                    >
                      {settings.currencySymbol}{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Change Calculation Box */}
              <div className="p-3.5 rounded-xl bg-[#25130b] border border-amber-900/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-200/70 block">Change to Return</span>
                  {cashShortage > 0 ? (
                    <span className="text-xs text-red-400 font-semibold flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Short by {settings.currencySymbol}{cashShortage}
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Exact or sufficient
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold font-mono text-emerald-400">
                    {settings.currencySymbol}{cashChange}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CARD MODE */}
          {paymentMethod === 'Card' && (
            <div className="space-y-4 text-center">
              <div className="p-6 rounded-2xl bg-[#25130b] border border-amber-900/40 flex flex-col items-center">
                <CreditCard className="w-14 h-14 text-amber-400 mb-2 stroke-[1.5]" />
                <h4 className="text-sm font-bold text-white">Swipe or Tap on Card EDC Machine</h4>
                <p className="text-xs text-amber-200/70 mt-1 max-w-xs">
                  Visa, Mastercard, RuPay & NFC Contactless tap accepted.
                </p>
                <div className="mt-4 p-2 bg-[#140b07] rounded-lg border border-amber-900/50 w-full flex items-center justify-between text-xs font-mono text-amber-300">
                  <span>Terminal Ref:</span>
                  <span className="font-bold">{cardAuthNumber}</span>
                </div>
              </div>
            </div>
          )}

          {/* SPLIT MODE */}
          {paymentMethod === 'Split' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-amber-200/90 mb-1.5">
                  Cash Portion (₹)
                </label>
                <input
                  type="number"
                  value={splitCashAmount}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setSplitCashAmount(val);
                  }}
                  className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-base font-mono font-bold text-amber-400 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#25130b] border border-amber-900/40 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-amber-200/70">Remaining via UPI / Card</span>
                  <span className="font-mono font-bold text-amber-400">
                    {settings.currencySymbol}{splitUpiAmount}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-amber-900/30 text-white font-semibold">
                  <span>Total Bill Amount</span>
                  <span className="font-mono">{settings.currencySymbol}{cartGrandTotal}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-[#140b07] border-t border-amber-900/50">
          <button
            onClick={handleCompleteOrder}
            disabled={paymentMethod === 'Cash' && cashTendered < cartGrandTotal}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
              paymentMethod === 'Cash' && cashTendered < cartGrandTotal
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-950/80'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Generate Bill & Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
