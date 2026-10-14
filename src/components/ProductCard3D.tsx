import React, { useState } from 'react';
import { Plus, Coffee, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard3D: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, settings, cart } = useApp();
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Check how many of this product are in the cart
  const quantityInCart = cart
    .filter(item => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    setIsAdding(true);
    addToCart(product, 'Regular', [], 1);
    setTimeout(() => setIsAdding(false), 200);
  };

  const isLowStock = product.stock > 0 && product.stock <= product.minStockAlert;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="card-3d-hover group relative flex flex-col rounded-2xl bg-[#26140d]/90 border border-amber-900/40 p-2.5 text-left cursor-pointer transition-all duration-200 shadow-md hover:border-amber-500/40"
    >
      {/* Product Image Slot with Fallback */}
      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#3b2015] to-[#1a0d08] mb-2.5">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-950 to-[#22120b] text-amber-300/70 p-2 text-center">
            <Coffee className="w-8 h-8 text-amber-500/80 mb-1" />
            <span className="text-[11px] font-medium leading-tight">{product.name}</span>
          </div>
        )}

        {/* Stock Status Badge */}
        {isOutOfStock ? (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-950/90 border border-red-700/60 text-red-200 text-[10px] font-bold tracking-wide">
            Sold Out
          </div>
        ) : isLowStock ? (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-950/90 border border-amber-500/60 text-amber-300 text-[10px] font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Only {product.stock} left</span>
          </div>
        ) : null}

        {/* Quantity in cart overlay counter */}
        {quantityInCart > 0 && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-mono font-bold text-xs flex items-center justify-center shadow-lg border-2 border-[#180d08]">
            {quantityInCart}
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-amber-300 transition-colors">
              {product.name}
            </h3>
          </div>
          <p className="text-[11px] text-amber-200/60 line-clamp-1 mt-0.5">
            {product.description}
          </p>
        </div>

        {/* Price and Action Button */}
        <div className="mt-2.5 pt-2 border-t border-amber-900/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400/80 block leading-none font-medium">Regular</span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-amber-400 tracking-tight">
              {settings.currencySymbol}{product.price}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`min-h-[36px] px-2.5 sm:px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
              isOutOfStock
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : isAdding
                ? 'bg-emerald-500 text-white scale-95'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-95 shadow-md shadow-amber-950/40'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
