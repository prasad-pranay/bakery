import { create } from "zustand";
import {Product} from "../type/product";
import { cartFullType, cartItemType } from "../type/cart";
import { Order } from "../component/OrdersModal";

export type SavedAddress = {
  addressLine1: string;
  city: string;
  country: string;
  id: string;
  isDefault: boolean;
  label: string;
  name: string;
  phone: string;
  postalCode: string;
  state: string;
  _id: string;
};
export type SavedPaymentMethod = {
  provider: string;
  paymentMethodId: string;
  type: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
};

export type User = {
  id: string;
  _id?: string;
  name: string;
  email: string;
  savedAddresses: SavedAddress[],
  payment: SavedPaymentMethod[]
};

type AuthState = {
  allUsers: User[]|null;
  setAllUsers: (allUsers:User[]|null)=>void;
  user: User | null;
  setUser: (user: User | null) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  cart: cartItemType[];
  setCartItem: (cart: cartItemType[]) => void;
  showCart: boolean;
   toggleShowCart: () => void;
   showOrders: boolean;
   toggleShowOrders: () => void;
   orders: Order[],
   setOrder: (orders: Order[]) => void;
   admin: boolean;
   setAdmin: (admin:boolean)=>void;
   adminData: DashboardData;
   setAdminData: (adminData: DashboardData) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  allUsers: null,
  setAllUsers: (allUsers:User[]|null)=>set({allUsers}),
  user: null,
  setUser: (user) => set({ user }),
  products: [],
  setProducts: (products) => set({ products }),
  cart: [],
  setCartItem: (cart: cartItemType[]) => set({ cart }),
  showCart: false,
  toggleShowCart: () =>
    set((state) => ({
      showCart: !state.showCart,
    })),
  showOrders: false,
  toggleShowOrders: () =>
    set((state) => ({
      showOrders: !state.showOrders,
    })),
    orders: [],
    setOrder: (orders: Order[]) => set({ orders }),
    admin: false,
    setAdmin: (admin:boolean)=> set({admin}),
    adminData: {
  totalUsers: 0,
  totalProducts: 0,
  lowStockProducts: 0,
  soldOutProducts: 0,
  totalOrders: 0,
  pendingOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  revenue: 0,
},
    setAdminData: (adminData:DashboardData) => set({adminData}),
    
}));



