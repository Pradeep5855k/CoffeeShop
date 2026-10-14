import React, { useState } from 'react';
import { X, Printer, Share2, Copy, Check, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReceiptModal: React.FC = () => {
  const { activeOrderForReceipt, setActiveOrderForReceipt, settings } = useApp();
  const [copied, setCopied] = useState(false);

  if (!activeOrderForReceipt) return null;

  const order = activeOrderForReceipt;
  const formattedDate = new Date(order.timestamp).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const billText = `*${settings.shopName}*
${settings.address}
Phone: ${settings.phone}
GSTIN: ${settings.gstin}
--------------------------------
Invoice: ${order.invoiceNumber}
Date: ${formattedDate}
Cashier: ${order.cashierName}
${order.customerName ? `Customer: ${order.customerName}` : ''}
${order.tableNumber ? `Table: ${order.tableNumber}` : `Type: ${order.orderType}`}
--------------------------------
${order.items
  .map(
    i =>
      `${i.name} (${i.selectedSize}) x${i.quantity} = ${settings.currencySymbol}${i.itemTotal}`
  )
  .join('\n')}
--------------------------------
Subtotal: ${settings.currencySymbol}${order.subtotal}
${order.discountAmount > 0 ? `Discount (${order.discountPercentage}%): -${settings.currencySymbol}${order.discountAmount}\n` : ''}GST (${order.gstRate}%): ${settings.currencySymbol}${order.totalGst}
TOTAL PAID: ${settings.currencySymbol}${order.grandTotal} (${order.paymentMethod})
--------------------------------
${settings.receiptFooterMessage}`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(billText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(billText);
    const phone = order.customerPhone ? `91${order.customerPhone.replace(/\D/g, '')}` : '';
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt ${order.invoiceNumber} - ${settings.shopName}`,
          text: billText,
        });
      } catch {
        // ignore share cancellation
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm sm:max-w-md bg-[#180d08] border border-amber-900/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] text-stone-100">
        {/* Top Action Bar */}
        <div className="p-3.5 bg-[#25130b] border-b border-amber-900/40 flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 font-heading">
            Receipt #{order.invoiceNumber}
          </span>
          <button
            onClick={() => setActiveOrderForReceipt(null)}
            className="w-7 h-7 rounded-full bg-amber-950 text-amber-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Receipt Container (Realistic Paper Design) */}
        <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-stone-900/40">
          <div
            id="thermal-receipt-print-area"
            className="w-full max-w-[340px] bg-white text-black p-5 rounded-lg shadow-xl font-mono text-[11px] leading-snug relative"
          >
            {/* Top serrated paper visual effect */}
            <div className="text-center pb-3 border-b border-dashed border-gray-400">
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                {settings.shopName}
              </h2>
              <p className="text-[10px] text-gray-700 mt-0.5">{settings.address}</p>
              <p className="text-[10px] text-gray-700">Phone: {settings.phone}</p>
              <p className="text-[10px] text-gray-800 font-bold mt-1">GSTIN: {settings.gstin}</p>
            </div>

            {/* Bill Meta */}
            <div className="py-2.5 border-b border-dashed border-gray-400 text-[10px] space-y-0.5">
              <div className="flex justify-between">
                <span>INVOICE: <strong>{order.invoiceNumber}</strong></span>
                <span>{order.orderType.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE: {formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>CASHIER: {order.cashierName}</span>
                {order.tableNumber && <span>{order.tableNumber}</span>}
              </div>
              {order.customerName && (
                <div className="flex justify-between">
                  <span>CUSTOMER: {order.customerName}</span>
                  {order.customerPhone && <span>{order.customerPhone}</span>}
                </div>
              )}
            </div>

            {/* Line Items Table */}
            <div className="py-2.5 border-b border-dashed border-gray-400">
              <div className="flex justify-between font-bold text-[10px] mb-1">
                <span className="w-1/2">ITEM</span>
                <span className="w-1/6 text-center">QTY</span>
                <span className="w-1/3 text-right">TOTAL</span>
              </div>
              {order.items.map(item => (
                <div key={item.id} className="mb-1.5">
                  <div className="flex justify-between">
                    <span className="w-1/2 font-semibold truncate">{item.name}</span>
                    <span className="w-1/6 text-center">{item.quantity}</span>
                    <span className="w-1/3 text-right font-bold">
                      {settings.currencySymbol}{item.itemTotal}
                    </span>
                  </div>
                  <div className="text-[9px] text-gray-600 pl-1">
                    {item.selectedSize} @ {settings.currencySymbol}{item.unitPrice}
                    {item.selectedAddOns.length > 0 && ` (+${item.selectedAddOns.map(a => a.name).join(', ')})`}
                  </div>
                </div>
              ))}
            </div>

            {/* Tax Breakdown & Totals */}
            <div className="py-2.5 border-b border-dashed border-gray-400 text-[10px] space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{settings.currencySymbol}{order.subtotal}</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-gray-800">
                  <span>Discount ({order.discountPercentage}%):</span>
                  <span>-{settings.currencySymbol}{order.discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>CGST ({(order.gstRate / 2).toFixed(1)}%):</span>
                <span>{settings.currencySymbol}{order.cgst}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST ({(order.gstRate / 2).toFixed(1)}%):</span>
                <span>{settings.currencySymbol}{order.sgst}</span>
              </div>

              <div className="flex justify-between text-xs font-bold pt-1 border-t border-gray-300">
                <span>GRAND TOTAL:</span>
                <span>{settings.currencySymbol}{order.grandTotal}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="py-2 text-[10px] flex justify-between">
              <span>Payment Mode: <strong>{order.paymentMethod}</strong></span>
              <span className="text-emerald-800 font-bold uppercase">{order.paymentStatus}</span>
            </div>

            {order.paymentMethod === 'Cash' && order.amountReceived && (
              <div className="text-[9px] text-gray-600 space-y-0.5">
                <div className="flex justify-between">
                  <span>Cash Paid:</span>
                  <span>{settings.currencySymbol}{order.amountReceived}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Change Given:</span>
                  <span>{settings.currencySymbol}{order.changeReturned}</span>
                </div>
              </div>
            )}

            {/* Footer greeting */}
            <div className="pt-3 text-center text-[10px] text-gray-600 border-t border-dashed border-gray-400 mt-2">
              <p>{settings.receiptFooterMessage}</p>
              <p className="mt-1 font-bold">*** VISIT AGAIN ***</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3.5 bg-[#140b07] border-t border-amber-900/50 grid grid-cols-3 gap-2">
          <button
            onClick={handlePrint}
            className="py-2.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleCopyText}
            className="py-2.5 px-2 rounded-xl bg-[#25130b] hover:bg-[#2d170e] border border-amber-800/40 text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
