export type CategoryId = 'all' | 'fast-food' | 'pizzas' | 'meals-biryani' | 'bakery' | 'desserts' | 'beverages';

export interface CustomizationOption {
  name: string;
  price: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: CategoryId;
  image: string;
  rating: number;
  reviewsCount: number;
  isVeg: boolean;
  isSpicy?: boolean;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  prepTime: string; // e.g. "20-25 min"
  calories?: number;
  customization?: {
    sizes?: CustomizationOption[];
    addOns?: CustomizationOption[];
    spiceLevels?: string[];
  };
  available: boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  description: string;
  itemCount?: number;
}

export interface CartItem {
  cartItemId: string; // unique combo id
  item: FoodItem;
  quantity: number;
  selectedSize?: CustomizationOption;
  selectedAddOns?: CustomizationOption[];
  selectedSpice?: string;
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  id: string;
  title: 'Home' | 'Work' | 'Other';
  street: string;
  landmark?: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface OrderDriver {
  name: string;
  phone: string;
  photo: string;
  rating: number;
  vehicle: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: Address;
  deliverySpeed: 'standard' | 'express';
  deliveryInstructions?: string;
  paymentMethod: 'cod' | 'upi' | 'card' | 'wallet';
  paymentStatus: 'pending' | 'paid';
  subtotal: number;
  discount: number;
  promoCode?: string;
  deliveryFee: number;
  tax: number;
  packagingFee: number;
  total: number;
  status: OrderStatus;
  placedAt: string; // ISO string or timestamp
  estimatedDeliveryTime: string;
  driver?: OrderDriver;
  orderTimeline?: {
    status: OrderStatus;
    time: string;
    description: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  savedAddresses: Address[];
  favoriteItemIds: string[];
}

export interface Review {
  id: string;
  itemId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount?: number;
}

export interface PromoCoupon {
  code: string;
  title: string;
  discountPercentage: number;
  maxDiscount?: number;
  minOrder: number;
  description: string;
}

export interface TableReservation {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  guestsCount: number;
  date: string;
  timeSlot: string;
  seatingArea: 'indoor' | 'terrace' | 'vip' | 'chef-counter' | 'candlelight';
  occasion?: string;
  specialRequests?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}
