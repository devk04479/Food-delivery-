/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CATEGORIES, 
  INITIAL_FOOD_ITEMS, 
  PROMO_COUPONS, 
  INITIAL_REVIEWS, 
  INITIAL_ADDRESSES, 
  INITIAL_ORDERS 
} from './data/mockData';
import { 
  FoodItem, 
  CartItem, 
  CategoryId, 
  Order, 
  OrderStatus, 
  PromoCoupon, 
  Review, 
  Address, 
  UserProfile, 
  CustomizationOption 
} from './types';

// Components
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { CategoriesBar } from './components/CategoriesBar';
import { FoodCard } from './components/FoodCard';
import { FoodDetailModal } from './components/FoodDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { UserAccountModal } from './components/UserAccountModal';
import { AdminPanel } from './components/AdminPanel';
import { AboutContact } from './components/AboutContact';
import { OffersPage } from './components/OffersPage';
import { AddressSelectorModal } from './components/AddressSelectorModal';
import { TableBookingSection } from './components/TableBookingSection';
import { RestaurantMapSection } from './components/RestaurantMapSection';
import { Toast, ToastMessage } from './components/Toast';

import { 
  Sparkles, 
  SlidersHorizontal, 
  Star, 
  Flame, 
  Utensils, 
  ShoppingBag, 
  Home, 
  Percent, 
  User, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';

export default function App() {
  // App navigation state
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'offers' | 'about' | 'orders' | 'admin' | 'book-table'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'nonveg' | 'spicy' | 'chef'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [detailFoodItem, setDetailFoodItem] = useState<FoodItem | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);

  // Data states with persistence
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('zestbite_food_items');
    return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('zestbite_cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCoupon | null>(null);

  const [savedAddresses, setSavedAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('zestbite_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(() => {
    return savedAddresses[0] || null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('zestbite_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('zestbite_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('zestbite_user');
    if (saved) return JSON.parse(saved);
    return {
      id: 'usr-1',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      phone: '+1 (555) 438-9201',
      savedAddresses: INITIAL_ADDRESSES,
      favoriteItemIds: ['ff-1', 'meal-1', 'des-1'],
    };
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('zestbite_food_items', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('zestbite_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('zestbite_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('zestbite_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    localStorage.setItem('zestbite_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('zestbite_user', JSON.stringify(user));
    }
  }, [user]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Cart math
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Category counts calculation
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    foodItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [foodItems]);

  // Filtered Food Items
  const filteredFoodItems = useMemo(() => {
    return foodItems.filter((item) => {
      // Category filter
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      
      // Search query
      const matchesSearch = searchQuery.trim() === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Dietary filter
      let matchesDiet = true;
      if (dietaryFilter === 'veg') matchesDiet = item.isVeg;
      if (dietaryFilter === 'nonveg') matchesDiet = !item.isVeg;
      if (dietaryFilter === 'spicy') matchesDiet = Boolean(item.isSpicy);
      if (dietaryFilter === 'chef') matchesDiet = Boolean(item.isChefSpecial || item.isBestseller);

      return matchesCat && matchesSearch && matchesDiet;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Default: popular / bestseller first
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return b.rating - a.rating;
    });
  }, [foodItems, selectedCategory, searchQuery, dietaryFilter, sortBy]);

  // Cart operations
  const handleAddToCart = (item: FoodItem) => {
    const cartItemId = `${item.id}-default`;
    setCartItems((prev) => {
      const existing = prev.find((c) => c.cartItemId === cartItemId);
      if (existing) {
        return prev.map((c) =>
          c.cartItemId === cartItemId
            ? { ...c, quantity: c.quantity + 1, totalPrice: (c.quantity + 1) * c.unitPrice }
            : c
        );
      } else {
        return [
          ...prev,
          {
            cartItemId,
            item,
            quantity: 1,
            unitPrice: item.price,
            totalPrice: item.price,
          },
        ];
      }
    });
    showToast(`Added "${item.name}" to your basket!`, 'success');
  };

  const handleRemoveFromCart = (item: FoodItem) => {
    const cartItemId = `${item.id}-default`;
    setCartItems((prev) => {
      const existing = prev.find((c) => c.cartItemId === cartItemId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((c) => c.cartItemId !== cartItemId);
      } else {
        return prev.map((c) =>
          c.cartItemId === cartItemId
            ? { ...c, quantity: c.quantity - 1, totalPrice: (c.quantity - 1) * c.unitPrice }
            : c
        );
      }
    });
  };

  const handleAddToCartWithOptions = (
    item: FoodItem,
    quantity: number,
    selectedSize?: CustomizationOption,
    selectedAddOns?: CustomizationOption[],
    selectedSpice?: string,
    specialInstructions?: string
  ) => {
    const sizePart = selectedSize ? selectedSize.name : 'std';
    const addOnsPart = selectedAddOns && selectedAddOns.length > 0 
      ? selectedAddOns.map((a) => a.name).sort().join(',') 
      : 'none';
    const spicePart = selectedSpice || 'none';
    const cartItemId = `${item.id}-${sizePart}-${addOnsPart}-${spicePart}`;

    const sizePrice = selectedSize ? selectedSize.price : 0;
    const addOnsPrice = (selectedAddOns || []).reduce((s, a) => s + a.price, 0);
    const unitPrice = item.price + sizePrice + addOnsPrice;
    const totalPrice = unitPrice * quantity;

    setCartItems((prev) => {
      const existing = prev.find((c) => c.cartItemId === cartItemId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        return prev.map((c) =>
          c.cartItemId === cartItemId
            ? { ...c, quantity: newQty, totalPrice: newQty * c.unitPrice, specialInstructions }
            : c
        );
      } else {
        return [
          ...prev,
          {
            cartItemId,
            item,
            quantity,
            selectedSize,
            selectedAddOns,
            selectedSpice,
            specialInstructions,
            unitPrice,
            totalPrice,
          },
        ];
      }
    });

    showToast(`Added ${quantity}x "${item.name}" with custom options!`, 'success');
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems((prev) => prev.filter((c) => c.cartItemId !== cartItemId));
    } else {
      setCartItems((prev) =>
        prev.map((c) =>
          c.cartItemId === cartItemId
            ? { ...c, quantity: newQuantity, totalPrice: newQuantity * c.unitPrice }
            : c
        )
      );
    }
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((c) => c.cartItemId !== cartItemId));
    showToast('Item removed from basket', 'info');
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Basket cleared', 'info');
  };

  // Promo Code handling
  const handleApplyPromo = (code: string): boolean => {
    const coupon = PROMO_COUPONS.find((p) => p.code.toUpperCase() === code.toUpperCase().trim());
    if (coupon) {
      if (cartSubtotal >= coupon.minOrder) {
        setAppliedPromo(coupon);
        showToast(`Promo "${coupon.code}" applied! Enjoy savings.`, 'success');
        return true;
      } else {
        showToast(`Minimum order of $${coupon.minOrder} required for this coupon`, 'error');
        return false;
      }
    }
    showToast('Invalid coupon code', 'error');
    return false;
  };

  // Favorites toggle
  const handleToggleFavorite = (itemId: string) => {
    if (!user) {
      setIsUserModalOpen(true);
      return;
    }
    const isFav = user.favoriteItemIds.includes(itemId);
    const newFavs = isFav
      ? user.favoriteItemIds.filter((id) => id !== itemId)
      : [...user.favoriteItemIds, itemId];
    
    setUser({ ...user, favoriteItemIds: newFavs });
    showToast(isFav ? 'Removed from Favorites' : 'Saved to Favorites ❤️', 'info');
  };

  // Order placement
  const handlePlaceOrder = (orderData: Partial<Order>) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      items: orderData.items || cartItems,
      customerName: orderData.customerName || 'Alex Johnson',
      customerPhone: orderData.customerPhone || '+1 (555) 438-9201',
      customerEmail: orderData.customerEmail,
      deliveryAddress: orderData.deliveryAddress || savedAddresses[0],
      deliverySpeed: orderData.deliverySpeed || 'standard',
      deliveryInstructions: orderData.deliveryInstructions,
      paymentMethod: orderData.paymentMethod || 'upi',
      paymentStatus: orderData.paymentStatus || 'paid',
      subtotal: orderData.subtotal || cartSubtotal,
      discount: orderData.discount || 0,
      promoCode: orderData.promoCode,
      deliveryFee: orderData.deliveryFee || 0,
      tax: orderData.tax || 0,
      packagingFee: orderData.packagingFee || 1.20,
      total: orderData.total || cartSubtotal,
      status: 'placed',
      placedAt: new Date().toISOString(),
      estimatedDeliveryTime: orderData.deliverySpeed === 'express' ? '15-20 mins' : '25-30 mins',
      driver: orderData.driver,
      orderTimeline: [
        { status: 'placed', time: 'Just now', description: 'Order received and kitchen confirmed' },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setAppliedPromo(null);
    setIsCheckoutOpen(false);
    setActiveTrackingOrder(newOrder);
    setIsOrderTrackingOpen(true);
    showToast('🎉 Order placed successfully! Kitchen is preparing your meal.', 'success');
  };

  // Admin order status update
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = ord.orderTimeline ? [...ord.orderTimeline] : [];
          let desc = 'Status updated';
          if (newStatus === 'preparing') desc = 'Chef is grilling & assembling fresh ingredients';
          if (newStatus === 'on_the_way') desc = 'Delivery partner picked up package and is en route';
          if (newStatus === 'delivered') desc = 'Delivered at door step safely';
          if (newStatus === 'cancelled') desc = 'Order cancelled by restaurant manager';

          updatedTimeline.push({
            status: newStatus,
            time: 'Just now',
            description: desc,
          });

          return {
            ...ord,
            status: newStatus,
            orderTimeline: updatedTimeline,
          };
        }
        return ord;
      })
    );

    // If currently tracking this order, update active modal as well
    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    }

    showToast(`Order #${orderId} status set to "${newStatus.replace('_', ' ').toUpperCase()}"`, 'info');
  };

  // Admin menu management
  const handleToggleItemAvailability = (itemId: string) => {
    setFoodItems((prev) =>
      prev.map((dish) =>
        dish.id === itemId ? { ...dish, available: !dish.available } : dish
      )
    );
    showToast('Dish stock status updated', 'info');
  };

  const handleAddNewFoodItem = (newItem: FoodItem) => {
    setFoodItems((prev) => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to the restaurant catalog!`, 'success');
  };

  const handleDeleteFoodItem = (itemId: string) => {
    setFoodItems((prev) => prev.filter((d) => d.id !== itemId));
    showToast('Dish removed from catalog', 'info');
  };

  // User management
  const handleLogin = (name: string, email: string, phone: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      savedAddresses,
      favoriteItemIds: ['ff-1', 'meal-1'],
    };
    setUser(newUser);
    showToast(`Welcome, ${name}! Signed in successfully.`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('zestbite_user');
    showToast('Signed out of account', 'info');
  };

  const handleAddNewAddress = (newAddr: Omit<Address, 'id'>) => {
    const addressWithId: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    };
    setSavedAddresses((prev) => [addressWithId, ...prev]);
    setSelectedAddress(addressWithId);
    showToast('New delivery address saved!', 'success');
  };

  const handleDeleteAddress = (addressId: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== addressId));
    if (selectedAddress?.id === addressId) {
      setSelectedAddress(savedAddresses.find((a) => a.id !== addressId) || null);
    }
    showToast('Address removed', 'info');
  };

  // Review submission
  const handleAddReview = (newRev: { itemId: string; userName: string; rating: number; comment: string }) => {
    const fullReview: Review = {
      id: `rev-${Date.now()}`,
      itemId: newRev.itemId,
      userName: newRev.userName,
      rating: newRev.rating,
      comment: newRev.comment,
      date: 'Just now',
    };
    setReviews((prev) => [fullReview, ...prev]);
    // update rating on food item
    setFoodItems((prev) =>
      prev.map((f) => {
        if (f.id === newRev.itemId) {
          const totalScore = f.rating * f.reviewsCount + newRev.rating;
          const newCount = f.reviewsCount + 1;
          return {
            ...f,
            rating: Number((totalScore / newCount).toFixed(1)),
            reviewsCount: newCount,
          };
        }
        return f;
      })
    );
    showToast('Taste review submitted! Thank you.', 'success');
  };

  // Re-order past order items
  const handleReorder = (order: Order) => {
    order.items.forEach((it) => {
      setCartItems((prev) => [...prev, { ...it, cartItemId: `reorder-${Date.now()}-${Math.random()}` }]);
    });
    setIsCartOpen(true);
    showToast('Previous dishes added to your basket!', 'success');
  };

  const favoriteFoodItems = useMemo(() => {
    if (!user) return [];
    return foodItems.filter((f) => user.favoriteItemIds.includes(f.id));
  }, [foodItems, user]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Main Header / Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        favoritesCount={user?.favoriteItemIds.length || 0}
        onOpenFavorites={() => {
          if (!user) setIsUserModalOpen(true);
          else setIsUserModalOpen(true);
        }}
        user={user}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedAddress={selectedAddress}
        onSelectAddressModal={() => setIsAddressModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 lg:pb-12">
        {/* VIEW 1: ADMIN PANEL */}
        {activeTab === 'admin' && (
          <AdminPanel
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            foodItems={foodItems}
            onToggleItemAvailability={handleToggleItemAvailability}
            onAddNewFoodItem={handleAddNewFoodItem}
            onDeleteFoodItem={handleDeleteFoodItem}
            onCloseAdmin={() => setActiveTab('home')}
          />
        )}

        {/* VIEW 2: OFFERS & DEALS PAGE */}
        {activeTab === 'offers' && (
          <OffersPage
            promos={PROMO_COUPONS}
            onApplyCoupon={(code) => {
              handleApplyPromo(code);
              setIsCartOpen(true);
            }}
            onExploreMenu={() => {
              setActiveTab('menu');
              setSelectedCategory('all');
            }}
          />
        )}

        {/* VIEW 3: ABOUT & CONTACT PAGE */}
        {activeTab === 'about' && <AboutContact />}

        {/* VIEW 4: MY ORDERS TRACKING TAB */}
        {activeTab === 'orders' && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
                  My Orders & Live Tracking
                </h1>
                <p className="text-xs sm:text-sm text-stone-500">
                  Track live kitchen status, view delivery invoices, and reorder favorites
                </p>
              </div>
              <button
                onClick={() => { setActiveTab('menu'); setSelectedCategory('all'); }}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                + Order More Food
              </button>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-stone-900">
                          Order #{ord.id}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'on_the_way'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        Placed on {new Date(ord.placedAt).toLocaleDateString()} at {new Date(ord.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] text-stone-400 uppercase font-bold">Total Paid</div>
                        <div className="font-mono font-black text-lg text-orange-600">
                          ${ord.total.toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTrackingOrder(ord);
                          setIsOrderTrackingOpen(true);
                        }}
                        className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Live Tracker
                      </button>
                    </div>
                  </div>

                  {/* Dishes in order */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
                        <img
                          src={it.item.image}
                          alt={it.item.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-stone-900 truncate">
                            {it.quantity}x {it.item.name}
                          </div>
                          <div className="font-mono text-stone-500 font-bold">${it.totalPrice.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                    <div>
                      <strong>Delivered to:</strong> {ord.deliveryAddress.street}, {ord.deliveryAddress.city}
                    </div>
                    <button
                      onClick={() => handleReorder(ord)}
                      className="text-xs font-bold text-orange-600 hover:underline"
                    >
                      Reorder This Meal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: TABLE BOOKING & RESTAURANT TIMINGS */}
        {activeTab === 'book-table' && (
          <div className="py-4 space-y-6">
            <TableBookingSection onSuccessToast={(msg) => showToast(msg, 'success')} />
            <RestaurantMapSection onSuccessToast={(msg) => showToast(msg, 'success')} />
          </div>
        )}

        {/* VIEW 6: HOMEPAGE & MENU PAGE */}
        {(activeTab === 'home' || activeTab === 'menu') && (
          <div className="space-y-4">
            
            {/* Show Hero Carousel Banner on Homepage */}
            {activeTab === 'home' && (
              <HeroSlider
                onExploreCategory={(cat) => {
                  setSelectedCategory(cat as CategoryId);
                  setActiveTab('menu');
                }}
                onApplyCouponCode={(code) => {
                  handleApplyPromo(code);
                  setIsCartOpen(true);
                }}
                onOrderNow={() => {
                  setActiveTab('menu');
                  setSelectedCategory('all');
                }}
              />
            )}

            {/* Categories Selector Bar */}
            <CategoriesBar
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                if (activeTab !== 'menu') setActiveTab('menu');
              }}
              categoryCounts={categoryCounts}
            />

            {/* Filter, Dietary Badges & Sorting Bar */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative overflow-hidden bg-stone-950 rounded-3xl p-4 sm:p-5 border border-stone-800/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Dietary Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                  <span className="text-xs font-bold uppercase text-stone-400 tracking-wider shrink-0 mr-1">
                    Filters:
                  </span>

                  <button
                    onClick={() => setDietaryFilter('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      dietaryFilter === 'all'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30'
                        : 'bg-stone-900 text-stone-300 border border-stone-800 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    All Dishes
                  </button>

                  <button
                    onClick={() => setDietaryFilter('veg')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      dietaryFilter === 'veg'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-stone-900 text-stone-300 border border-stone-800 hover:bg-stone-800 hover:text-emerald-400'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Pure Veg</span>
                  </button>

                  <button
                    onClick={() => setDietaryFilter('nonveg')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      dietaryFilter === 'nonveg'
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : 'bg-stone-900 text-stone-300 border border-stone-800 hover:bg-stone-800 hover:text-red-400'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span>Non-Veg</span>
                  </button>

                  <button
                    onClick={() => setDietaryFilter('spicy')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      dietaryFilter === 'spicy'
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                        : 'bg-stone-900 text-stone-300 border border-stone-800 hover:bg-stone-800 hover:text-orange-400'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>Spicy Craving</span>
                  </button>

                  <button
                    onClick={() => setDietaryFilter('chef')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      dietaryFilter === 'chef'
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                        : 'bg-stone-900 text-stone-300 border border-stone-800 hover:bg-stone-800 hover:text-amber-400'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Chef's Choice</span>
                  </button>
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2.5 justify-end">
                  <SlidersHorizontal className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="text-xs font-bold text-stone-300">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs font-bold bg-stone-900 text-stone-200 py-2 px-3 rounded-xl border border-stone-800 focus:outline-none focus:border-orange-500 cursor-pointer shadow-xs"
                  >
                    <option value="popular" className="bg-stone-900 text-stone-200">Popularity / Bestseller</option>
                    <option value="rating" className="bg-stone-900 text-stone-200">Highest Rated (★ 4.8+)</option>
                    <option value="price-asc" className="bg-stone-900 text-stone-200">Price: Low to High</option>
                    <option value="price-desc" className="bg-stone-900 text-stone-200">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Food Items Grid Section with Golden Background */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-amber-100/80 to-yellow-100/90 border-2 border-amber-300/80 p-6 sm:p-8 shadow-xl shadow-amber-500/10 space-y-6">
                
                {/* Decorative Golden Ambient Glows */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/25 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-300/60 pb-5">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-900 font-bold text-[11px] uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      <span>Curated Luxury Dining • Top 5 Selection</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-amber-950 font-serif tracking-tight">
                      {selectedCategory === 'all' ? 'Featured Gourmet Collection' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-900/80 font-medium">
                      Showing top {Math.min(5, filteredFoodItems.length)} signature dishes ready for hot delivery
                    </p>
                  </div>

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-200/80 hover:bg-amber-300/80 px-3.5 py-1.5 rounded-xl border border-amber-400/60 transition-colors shadow-2xs w-fit"
                    >
                      <span>Clear Filter:</span>
                      <span className="font-extrabold underline">"{searchQuery}"</span>
                    </button>
                  )}
                </div>

                {filteredFoodItems.length === 0 ? (
                  <div className="relative z-10 py-16 text-center bg-white/80 backdrop-blur-md rounded-3xl border border-amber-300/80 space-y-3 shadow-xs">
                    <div className="w-16 h-16 rounded-full bg-amber-200/80 text-amber-800 flex items-center justify-center mx-auto">
                      <Utensils className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-amber-950">No matching gourmet dishes found</h3>
                    <p className="text-xs text-amber-900/70 max-w-sm mx-auto">
                      Try adjusting your search keyword or switching dietary filters to view delicious dishes.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setDietaryFilter('all');
                      }}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                    {filteredFoodItems.slice(0, 5).map((item) => {
                      // check quantity of this item currently in cart
                      const inCartCount = cartItems
                        .filter((c) => c.item.id === item.id)
                        .reduce((sum, c) => sum + c.quantity, 0);

                      return (
                        <FoodCard
                          key={item.id}
                          item={item}
                          quantityInCart={inCartCount}
                          onAddToCart={handleAddToCart}
                          onRemoveFromCart={handleRemoveFromCart}
                          onOpenDetailModal={(it) => setDetailFoodItem(it)}
                          isFavorite={user?.favoriteItemIds.includes(item.id) || false}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Table Booking & Operating Timings Section */}
            {activeTab === 'home' && (
              <>
                <TableBookingSection onSuccessToast={(msg) => showToast(msg, 'success')} />
                <RestaurantMapSection onSuccessToast={(msg) => showToast(msg, 'success')} />
              </>
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar for Quick Mobile Access when items > 0 */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-18 lg:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-30 animate-slideUp">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between bg-stone-900 hover:bg-black text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-700/80 cursor-pointer backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                {cartCount}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">View Food Basket</div>
                <div className="text-[11px] text-stone-400">{cartCount} items selected</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-base text-amber-400">
                ${cartSubtotal.toFixed(2)}
              </span>
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 lg:hidden px-2 py-2 flex items-center justify-around text-[10px] font-bold">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 p-1 ${activeTab === 'home' ? 'text-orange-600' : 'text-stone-500'}`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => { setActiveTab('menu'); setSelectedCategory('all'); }}
          className={`flex flex-col items-center gap-0.5 p-1 ${activeTab === 'menu' ? 'text-orange-600' : 'text-stone-500'}`}
        >
          <Utensils className="w-5 h-5" />
          <span>Menu</span>
        </button>

        <button
          onClick={() => setActiveTab('book-table')}
          className={`flex flex-col items-center gap-0.5 p-1 ${activeTab === 'book-table' ? 'text-orange-600' : 'text-stone-500'}`}
        >
          <CalendarCheck className="w-5 h-5" />
          <span>Book Table</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`flex flex-col items-center gap-0.5 p-1 ${activeTab === 'offers' ? 'text-orange-600' : 'text-stone-500'}`}
        >
          <Percent className="w-5 h-5" />
          <span>Offers</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-0.5 p-1 ${activeTab === 'orders' ? 'text-orange-600' : 'text-stone-500'}`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Orders</span>
        </button>
      </div>

      {/* MODALS */}

      {/* 1. Food Detail / Customization Modal */}
      <FoodDetailModal
        item={detailFoodItem}
        onClose={() => setDetailFoodItem(null)}
        onAddToCartWithOptions={handleAddToCartWithOptions}
        isFavorite={detailFoodItem ? (user?.favoriteItemIds.includes(detailFoodItem.id) || false) : false}
        onToggleFavorite={handleToggleFavorite}
        reviews={reviews}
        onAddReview={handleAddReview}
      />

      {/* 2. Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={() => {
          setAppliedPromo(null);
          showToast('Coupon removed', 'info');
        }}
        availablePromos={PROMO_COUPONS}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        appliedPromo={appliedPromo}
        user={user}
        savedAddresses={savedAddresses}
        onAddNewAddress={handleAddNewAddress}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* 4. Live Order Confirmation & Tracking Modal */}
      <OrderConfirmationModal
        order={activeTrackingOrder}
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
        onViewMyOrders={() => {
          setIsOrderTrackingOpen(false);
          setActiveTab('orders');
        }}
        onReorder={handleReorder}
      />

      {/* 5. User Account & Profile Modal */}
      <UserAccountModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        orders={orders}
        onTrackOrder={(ord) => {
          setActiveTrackingOrder(ord);
          setIsOrderTrackingOpen(true);
        }}
        onReorder={handleReorder}
        savedAddresses={savedAddresses}
        onAddNewAddress={handleAddNewAddress}
        onDeleteAddress={handleDeleteAddress}
        favoriteItems={favoriteFoodItems}
        onAddToCart={handleAddToCart}
      />

      {/* 6. Address Selector Modal */}
      <AddressSelectorModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        savedAddresses={savedAddresses}
        selectedAddress={selectedAddress}
        onSelectAddress={(addr) => setSelectedAddress(addr)}
        onAddNewAddress={handleAddNewAddress}
      />

      {/* Global Footer */}
      <footer className="bg-stone-900 text-white pt-12 pb-24 lg:pb-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
          
          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-white font-serif">ZestBite</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Authentic artisanal meals crafted with love, delivered piping hot to your doorstep in 25-30 minutes.
            </p>
            <div className="text-[11px] text-amber-300 font-semibold">
              ⚡ 100% Contactless & Hygienic Delivery
            </div>
          </div>

          <div className="space-y-2 md:text-right">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">Delivery Hotline & Support (India)</h4>
            <p className="text-stone-400">
              Open Monday - Sunday<br />10:00 AM – 11:30 PM
            </p>
            <div className="text-base font-bold text-amber-300 font-mono">+91 1800 555 9378</div>
            <p className="text-[11px] text-stone-400">Block M, Connaught Place, New Delhi - 110001</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-stone-800 text-center text-[11px] text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} ZestBite Restaurant & Food Delivery. All rights reserved.</div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Food Safety Certification</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
