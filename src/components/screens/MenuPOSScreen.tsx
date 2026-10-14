import React, { useState } from 'react';
import { Search, Plus, Filter, Coffee, PlusCircle, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';
import { ProductCard3D } from '../ProductCard3D';
import { ProductDetailModal } from '../ProductDetailModal';

export const MenuPOSScreen: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    user,
    addProduct,
    settings,
  } = useApp();

  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('Coffee');
  const [newProdPrice, setNewProdPrice] = useState(120);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdStock, setNewProdStock] = useState(25);

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Coffee',
    'Tea',
    'Cold Drinks',
    'Snacks',
    'Cakes & Pastries',
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || newProdPrice <= 0) return;

    // Pick appropriate image based on category
    let defaultImg = '/src/assets/images/coffee_espresso_cup_1791951973005.jpg';
    if (newProdCategory === 'Coffee' || newProdCategory === 'Tea') {
      defaultImg = '/src/assets/images/coffee_cappuccino_latte_1791951972970.jpg';
    } else if (newProdCategory === 'Cold Drinks') {
      defaultImg = '/src/assets/images/cold_coffee_iced_latte_1791951974659.jpg';
    } else {
      defaultImg = '/src/assets/images/bakery_pastry_muffin_1791951974022.jpg';
    }

    addProduct({
      name: newProdName.trim(),
      category: newProdCategory,
      price: newProdPrice,
      sizePrices:
        newProdCategory === 'Coffee' || newProdCategory === 'Cold Drinks' || newProdCategory === 'Tea'
          ? { Small: -20, Regular: 0, Large: 30 }
          : { Regular: 0 },
      description: newProdDesc.trim() || `${newProdCategory} crafted with premium ingredients.`,
      image: defaultImg,
      stock: newProdStock,
      minStockAlert: 8,
      isAvailable: true,
      preparationTimeMinutes: 4,
    });

    setNewProdName('');
    setNewProdPrice(120);
    setNewProdDesc('');
    setShowAddProductModal(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden text-stone-100">
      {/* Search Bar & Category Scroller Header */}
      <div className="shrink-0 p-3 bg-[#1e1009] border-b border-amber-900/30 space-y-2.5">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search coffee, tea, muffins, cakes..."
              className="w-full bg-[#140b07] border border-amber-900/50 rounded-xl py-2 pl-9 pr-3 text-xs text-stone-100 placeholder:text-amber-200/40 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Admin Add Item Button */}
          {user.role === 'admin' && (
            <button
              onClick={() => setShowAddProductModal(true)}
              className="h-9 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Item</span>
            </button>
          )}
        </div>

        {/* Horizontal Category Buttons Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-[#140b07] text-amber-200/70 hover:text-white border border-amber-900/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredProducts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-amber-300/50 p-4">
            <Coffee className="w-12 h-12 mb-2 opacity-40" />
            <p className="text-sm font-semibold">No products found</p>
            <p className="text-xs mt-1 text-amber-200/60">
              Try searching for something else or pick another category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {filteredProducts.map(product => (
              <ProductCard3D
                key={product.id}
                product={product}
                onOpenDetails={p => setActiveModalProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Details Customization Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />

      {/* Add New Product Modal for Admin */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#20110a] border border-amber-900/60 rounded-3xl p-5 shadow-2xl text-stone-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white font-heading">
                Add Menu Item
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="w-7 h-7 rounded-full bg-amber-950 text-amber-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="e.g. Vanilla Bean Latte"
                  className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                  Category
                </label>
                <select
                  value={newProdCategory}
                  onChange={e => setNewProdCategory(e.target.value as ProductCategory)}
                  className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Coffee">Coffee</option>
                  <option value="Tea">Tea</option>
                  <option value="Cold Drinks">Cold Drinks</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Cakes & Pastries">Cakes & Pastries</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                    Base Price ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                    Initial Stock Units
                  </label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={e => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                  Description
                </label>
                <textarea
                  value={newProdDesc}
                  onChange={e => setNewProdDesc(e.target.value)}
                  placeholder="Aromatic notes, origin, ingredients..."
                  rows={2}
                  className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                Save Product to Menu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
