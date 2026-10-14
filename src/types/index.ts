export type ProductCategory = 'Coffee' | 'Tea' | 'Cold Drinks' | 'Snacks' | 'Cakes & Pastries';

export type ProductSize = 'Small' | 'Regular' | 'Large';

export interface ProductAddOn {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // Base price for Regular
  sizePrices?: Partial<Record<ProductSize, number>>;
  description: string;
  image: string;
  stock: number;
  minStockAlert: number;
  isAvailable: boolean;
  preparationTimeMinutes: number;
}

export interface CartItem {
  id: string; // unique item instance id
  productId: string;
  name: string;
  category: ProductCategory;
  selectedSize: ProductSize;
  sizePriceAdjustment: number;
  selectedAddOns: ProductAddOn[];
  unitPrice: number;
  quantity: number;
  itemTotal: number;
  notes?: string;
  image: string;
}

export type OrderStatus = 'Completed' | 'Pending' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Split';
export type OrderType = 'Dine-in' | 'Takeaway' | 'Delivery';

export interface Order {
  id: string;
  invoiceNumber: string;
  timestamp: string; // ISO string
  items: CartItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  gstRate: number; // e.g. 5
  cgst: number;
  sgst: number;
  totalGst: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending';
  amountReceived?: number;
  changeReturned?: number;
  customerName?: string;
  customerPhone?: string;
  tableNumber?: string;
  orderType: OrderType;
  orderStatus: OrderStatus;
  cashierName: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastVisit: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Ingredient' | 'Packaging' | 'Dairy';
  quantity: number;
  unit: 'kg' | 'L' | 'pcs' | 'boxes';
  minThreshold: number;
  costPerUnit: number;
  lastRestocked: string;
}

export interface ShopSettings {
  shopName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  gstRate: number; // percentage, e.g. 5
  currencySymbol: string; // '₹'
  upiId: string;
  receiptFooterMessage: string;
  printerPaperWidth: '58mm' | '80mm';
  autoPrintReceipt: boolean;
  soundEffects: boolean;
  lowStockThreshold: number;
  dailySalesTarget: number;
}

export interface UserSession {
  isAuthenticated: boolean;
  role: 'admin' | 'cashier';
  name: string;
  email: string;
}
