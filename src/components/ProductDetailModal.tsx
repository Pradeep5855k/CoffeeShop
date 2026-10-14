import React, { useState } from 'react';
import { X, Plus, Minus, Check, Coffee } from 'lucide-react';
import { Product, ProductAddOn, ProductSize } from '../types';
import { AVAILABLE_ADDONS } from '../data/initialData';
import { useApp } from '../context/AppContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, settings } = useApp();

  const [selectedSize, setSelectedSize] = useState<ProductSize>('Regular');
  const [selectedAddOns, setSelectedAddOns] = useState<ProductAddOn[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const isBeverage = product.category === 'Coffee' || product.category === 'Tea' || product.category === 'Cold Drinks';
  const sizeAdjustment = product.sizePrices?.[selectedSize] ?? 0;
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = product.price + sizeAdjustment + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddOn = (addon: ProductAddOn) => {
    setSelectedAddOns(prev =>
      prev.some(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedAddOns, quantity, notes.trim());
    onClose();
  };

  const sizes: ProductSize[] = ['Small', 'Regular', 'Large'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-[#20110a] border-t sm:border border-amber-900/60 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-stone-100">
        {/* Header with image */}
        <div className="relative aspect-[16/9] w-full shrink-0 bg-[#2d1810] overflow-hidden">
          {!imageError ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-950 to-[#22120b]">
              <Coffee className="w-12 h-12 text-amber-500 mb-2" />
              <span className="text-sm font-semibold">{product.name}</span>
            </div>
          )}

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#20110a] via-transparent to-black/40" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-amber-200 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Bottom Title in Image Header */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                {product.category}
              </span>
              <h2 className="text-xl font-extrabold text-white font-heading">
                {product.name}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-amber-300/80 block">From</span>
              <span className="text-xl font-bold font-mono text-amber-400">
                {settings.currencySymbol}{product.price}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          <p className="text-xs sm:text-sm text-amber-200/70 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection (for beverages or products with size options) */}
          {isBeverage && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-100 uppercase tracking-wider">
                  Select Cup Size
                </span>
                <span className="text-[11px] text-amber-400">Required</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map(size => {
                  const isSelected = selectedSize === size;
                  const diff = product.sizePrices?.[size] ?? 0;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                          : 'bg-[#180d08] border-amber-900/40 text-amber-200/70 hover:border-amber-700/50'
                      }`}
                    >
                      <div className="text-xs font-bold">{size}</div>
                      <div className="text-[10px] font-mono mt-0.5 text-amber-400">
                        {diff === 0 ? 'Standard' : diff > 0 ? `+${settings.currencySymbol}${diff}` : `-${settings.currencySymbol}${Math.abs(diff)}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extra Toppings / Add-ons (for drinks) */}
          {isBeverage && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-100 uppercase tracking-wider">
                  Custom Toppings & Add-ons
                </span>
                <span className="text-[11px] text-amber-300/60">Optional</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AVAILABLE_ADDONS.map(addon => {
                  const isChecked = selectedAddOns.some(a => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddOn(addon)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                        isChecked
                          ? 'bg-amber-500/15 border-amber-400/80 text-white'
                          : 'bg-[#180d08] border-amber-900/40 text-amber-200/75 hover:border-amber-700/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-stone-950'
                              : 'border-amber-600/40'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium">{addon.name}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        +{settings.currencySymbol}{addon.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Preparation Instructions */}
          <div>
            <label className="block text-xs font-bold text-amber-100 uppercase tracking-wider mb-1.5">
              Barista Instructions (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g., Less sugar, extra hot, oat milk froth"
              className="w-full bg-[#180d08] border border-amber-900/50 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Footer with Quantity Controls & Add to Cart */}
        <div className="shrink-0 p-4 bg-[#180d08] border-t border-amber-900/50 flex items-center justify-between gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center bg-[#24130b] border border-amber-900/60 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-200 hover:bg-amber-900/50 active:scale-95 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-mono font-bold text-sm text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-200 hover:bg-amber-900/50 active:scale-95 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-950/60 active:scale-[0.99] transition-all flex items-center justify-between"
          >
            <span>Add to Order</span>
            <span className="font-mono font-extrabold text-base">
              {settings.currencySymbol}{totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
