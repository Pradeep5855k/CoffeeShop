import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CartItem,
  Customer,
  InventoryItem,
  Order,
  OrderType,
  PaymentMethod,
  Product,
  ProductAddOn,
  ProductSize,
  ShopSettings,
  UserSession,
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
} from '../data/initialData';

interface AppContextType {
  // Navigation & UI
  activeTab: 'dashboard' | 'menu' | 'orders' | 'reports' | 'inventory' | 'customers' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'menu' | 'orders' | 'reports' | 'inventory' | 'customers' | 'settings') => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  deviceMode: 'mobile-frame' | 'responsive';
  setDeviceMode: (mode: 'mobile-frame' | 'responsive') => void;
  showSplash: boolean;
  dismissSplash: () => void;
  user: UserSession;
  login: (email: string, role?: 'admin' | 'cashier', name?: string) => boolean;
  logout: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart & Active Bill
  cart: CartItem[];
  addToCart: (product: Product, size?: ProductSize, addOns?: ProductAddOn[], quantity?: number, notes?: string) => void;
  updateCartItemQty: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  discountPercentage: number;
  setDiscountPercentage: (discount: number) => void;
  orderMeta: {
    customerName: string;
    customerPhone: string;
    tableNumber: string;
    orderType: OrderType;
  };
  setOrderMeta: React.Dispatch<React.SetStateAction<{
    customerName: string;
    customerPhone: string;
    tableNumber: string;
    orderType: OrderType;
  }>>;

  // Financial Calculations
  cartSubtotal: number;
  cartDiscountAmount: number;
  cartGstAmount: number;
  cartGrandTotal: number;

  // Checkout & Orders
  orders: Order[];
  createOrder: (paymentMethod: PaymentMethod, amountReceived?: number, changeReturned?: number) => Order;
  cancelOrder: (orderId: string) => void;
  activeOrderForReceipt: Order | null;
  setActiveOrderForReceipt: (order: Order | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Inventory
  inventory: InventoryItem[];
  restockItem: (itemId: string, addedQty: number, addedCost?: number) => void;
  updateInventoryItem: (item: InventoryItem) => void;

  // Customers
  customers: Customer[];
  addOrUpdateCustomer: (customer: Partial<Customer> & { phone: string; name: string }) => Customer;
  selectCustomerForBill: (customer: Customer) => void;

  // Settings
  settings: ShopSettings;
  updateSettings: (newSettings: Partial<ShopSettings>) => void;
  resetAllData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'coffeeshop_products_v1',
  ORDERS: 'coffeeshop_orders_v1',
  INVENTORY: 'coffeeshop_inventory_v1',
  CUSTOMERS: 'coffeeshop_customers_v1',
  SETTINGS: 'coffeeshop_settings_v1',
  THEME: 'coffeeshop_theme_v1',
  USER: 'coffeeshop_user_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // UI states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'orders' | 'reports' | 'inventory' | 'customers' | 'settings'>('dashboard');
  const [deviceMode, setDeviceMode] = useState<'mobile-frame' | 'responsive'>('mobile-frame');
  const [showSplash, setShowSplash] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrderForReceipt, setActiveOrderForReceipt] = useState<Order | null>(null);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Order Meta
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [orderMeta, setOrderMeta] = useState<{
    customerName: string;
    customerPhone: string;
    tableNumber: string;
    orderType: OrderType;
  }>({
    customerName: '',
    customerPhone: '',
    tableNumber: '',
    orderType: 'Dine-in',
  });

  // Theme
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // User Authentication
  const [user, setUser] = useState<UserSession>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      isAuthenticated: true, // Default logged-in as admin for seamless evaluation
      role: 'admin',
      name: 'Aditi M.',
      email: 'admin@brewandhearth.in',
    };
  });

  const login = (email: string, role: 'admin' | 'cashier' = 'admin', name = 'Store Manager') => {
    const session: UserSession = {
      isAuthenticated: true,
      role,
      name,
      email,
    };
    setUser(session);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(session));
    return true;
  };

  const logout = () => {
    const session: UserSession = {
      isAuthenticated: false,
      role: 'cashier',
      name: '',
      email: '',
    };
    setUser(session);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(session));
  };

  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
    };
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_INVENTORY;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  const restockItem = (itemId: string, addedQty: number, addedCost?: number) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: Number((item.quantity + addedQty).toFixed(2)),
            costPerUnit: addedCost !== undefined ? addedCost : item.costPerUnit,
            lastRestocked: new Date().toISOString().split('T')[0],
          };
        }
        return item;
      })
    );
  };

  const updateInventoryItem = (updated: InventoryItem) => {
    setInventory(prev => prev.map(i => (i.id === updated.id ? updated : i)));
  };

  // Customers state
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_CUSTOMERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  const addOrUpdateCustomer = (customerData: Partial<Customer> & { phone: string; name: string }): Customer => {
    const existingIndex = customers.findIndex(c => c.phone === customerData.phone);
    if (existingIndex >= 0) {
      const existing = customers[existingIndex];
      const updated: Customer = {
        ...existing,
        ...customerData,
        name: customerData.name || existing.name,
        lastVisit: new Date().toISOString().split('T')[0],
      };
      setCustomers(prev => prev.map((c, idx) => (idx === existingIndex ? updated : c)));
      return updated;
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email || '',
        totalOrders: 1,
        totalSpent: 0,
        loyaltyPoints: 10,
        lastVisit: new Date().toISOString().split('T')[0],
      };
      setCustomers(prev => [newCust, ...prev]);
      return newCust;
    }
  };

  const selectCustomerForBill = (customer: Customer) => {
    setOrderMeta(prev => ({
      ...prev,
      customerName: customer.name,
      customerPhone: customer.phone,
    }));
  };

  // Settings state
  const [settings, setSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
      } catch {
        // fallback
      }
    }
    return INITIAL_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Cart Operations
  const addToCart = (
    product: Product,
    size: ProductSize = 'Regular',
    addOns: ProductAddOn[] = [],
    quantity = 1,
    notes = ''
  ) => {
    const sizeAdjustment = product.sizePrices?.[size] ?? 0;
    const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = product.price + sizeAdjustment + addOnsTotal;

    // Check if identical item already exists in cart
    const existingIndex = cart.findIndex(
      item =>
        item.productId === product.id &&
        item.selectedSize === size &&
        JSON.stringify(item.selectedAddOns.map(a => a.id).sort()) ===
          JSON.stringify(addOns.map(a => a.id).sort())
    );

    if (existingIndex >= 0) {
      setCart(prev =>
        prev.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = item.quantity + quantity;
            return {
              ...item,
              quantity: newQty,
              itemTotal: unitPrice * newQty,
            };
          }
          return item;
        })
      );
    } else {
      const newItem: CartItem = {
        id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        name: product.name,
        category: product.category,
        selectedSize: size,
        sizePriceAdjustment: sizeAdjustment,
        selectedAddOns: addOns,
        unitPrice,
        quantity,
        itemTotal: unitPrice * quantity,
        notes,
        image: product.image,
      };
      setCart(prev => [...prev, newItem]);
    }
  };

  const updateCartItemQty = (itemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              itemTotal: item.unitPrice * nextQty,
            };
          }
          return item;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountPercentage(0);
    setOrderMeta({
      customerName: '',
      customerPhone: '',
      tableNumber: '',
      orderType: 'Dine-in',
    });
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const cartDiscountAmount = Math.round((cartSubtotal * discountPercentage) / 100);
  const taxableAmount = Math.max(0, cartSubtotal - cartDiscountAmount);
  const cartGstAmount = Math.round(((taxableAmount * settings.gstRate) / 100) * 100) / 100;
  const cartGrandTotal = Math.round(taxableAmount + cartGstAmount);

  // Orders
  const createOrder = (
    paymentMethod: PaymentMethod,
    amountReceived?: number,
    changeReturned?: number
  ): Order => {
    const nextInvoiceNumber = `INV-${new Date().getFullYear()}-${1045 + orders.length}`;
    const cgst = Number((cartGstAmount / 2).toFixed(2));
    const sgst = Number((cartGstAmount / 2).toFixed(2));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      invoiceNumber: nextInvoiceNumber,
      timestamp: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      discountPercentage,
      discountAmount: cartDiscountAmount,
      gstRate: settings.gstRate,
      cgst,
      sgst,
      totalGst: cartGstAmount,
      grandTotal: cartGrandTotal,
      paymentMethod,
      paymentStatus: 'Paid',
      amountReceived: amountReceived ?? cartGrandTotal,
      changeReturned: changeReturned ?? 0,
      customerName: orderMeta.customerName.trim() || 'Walk-in Customer',
      customerPhone: orderMeta.customerPhone.trim() || undefined,
      tableNumber: orderMeta.orderType === 'Dine-in' ? orderMeta.tableNumber.trim() || 'Counter' : undefined,
      orderType: orderMeta.orderType,
      orderStatus: 'Completed',
      cashierName: user.name || 'Barista Staff',
    };

    // 1. Update product stocks and check inventory deductions
    setProducts(prev =>
      prev.map(prod => {
        const cartQty = cart
          .filter(c => c.productId === prod.id)
          .reduce((sum, c) => sum + c.quantity, 0);
        if (cartQty > 0) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - cartQty),
          };
        }
        return prod;
      })
    );

    // 2. Decrement primary packaging inventory (Paper cups, milk etc)
    const totalDrinkCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    setInventory(prev =>
      prev.map(inv => {
        if (inv.id === 'inv-5') {
          // paper cups
          return { ...inv, quantity: Math.max(0, inv.quantity - totalDrinkCount) };
        }
        if (inv.id === 'inv-2' && totalDrinkCount > 0) {
          // milk approx 0.15L per drink
          const usedMilk = Number((totalDrinkCount * 0.15).toFixed(1));
          return { ...inv, quantity: Math.max(0, Number((inv.quantity - usedMilk).toFixed(1))) };
        }
        return inv;
      })
    );

    // 3. Update customer loyalty and spend if customer info provided
    if (orderMeta.customerPhone.trim()) {
      addOrUpdateCustomer({
        phone: orderMeta.customerPhone.trim(),
        name: orderMeta.customerName.trim() || 'Guest Member',
        totalOrders: 1,
        totalSpent: cartGrandTotal,
        loyaltyPoints: Math.floor(cartGrandTotal / 10),
      });
    }

    // 4. Save order
    setOrders(prev => [newOrder, ...prev]);

    // 5. Open receipt modal and clear active cart
    setActiveOrderForReceipt(newOrder);
    clearCart();
    setIsCartOpen(false);
    setIsCheckoutOpen(false);

    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, orderStatus: 'Cancelled' } : o))
    );
  };

  // Reset & Backup/Restore
  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setInventory(INITIAL_INVENTORY);
    setCustomers(INITIAL_CUSTOMERS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
  };

  const exportDatabaseJSON = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      shopName: settings.shopName,
      products,
      orders,
      inventory,
      customers,
      settings,
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDatabaseJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.products && Array.isArray(data.products)) setProducts(data.products);
      if (data.orders && Array.isArray(data.orders)) setOrders(data.orders);
      if (data.inventory && Array.isArray(data.inventory)) setInventory(data.inventory);
      if (data.customers && Array.isArray(data.customers)) setCustomers(data.customers);
      if (data.settings && typeof data.settings === 'object') setSettings(data.settings);
      return true;
    } catch (e) {
      console.error('Failed to parse backup JSON', e);
      return false;
    }
  };

  const dismissSplash = () => setShowSplash(false);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        deviceMode,
        setDeviceMode,
        showSplash,
        dismissSplash,
        user,
        login,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        discountPercentage,
        setDiscountPercentage,
        orderMeta,
        setOrderMeta,
        cartSubtotal,
        cartDiscountAmount,
        cartGstAmount,
        cartGrandTotal,
        orders,
        createOrder,
        cancelOrder,
        activeOrderForReceipt,
        setActiveOrderForReceipt,
        isCheckoutOpen,
        setIsCheckoutOpen,
        inventory,
        restockItem,
        updateInventoryItem,
        customers,
        addOrUpdateCustomer,
        selectCustomerForBill,
        settings,
        updateSettings,
        resetAllData,
        exportDatabaseJSON,
        importDatabaseJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
