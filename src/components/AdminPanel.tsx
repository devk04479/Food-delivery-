import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  ChefHat, 
  Bike, 
  CheckCircle2, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  ToggleLeft, 
  ToggleRight, 
  Edit3, 
  Sparkles, 
  Trash2, 
  Clock, 
  Phone,
  Flame
} from 'lucide-react';
import { FoodItem, Order, OrderStatus, CategoryId } from '../types';

interface AdminPanelProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  foodItems: FoodItem[];
  onToggleItemAvailability: (itemId: string) => void;
  onAddNewFoodItem: (item: FoodItem) => void;
  onDeleteFoodItem: (itemId: string) => void;
  onCloseAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  onUpdateOrderStatus,
  foodItems,
  onToggleItemAvailability,
  onAddNewFoodItem,
  onDeleteFoodItem,
  onCloseAdmin,
}) => {
  const [adminTab, setAdminTab] = useState<'orders' | 'menu' | 'metrics'>('orders');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');

  // Add Item Modal form state
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [dishName, setDishName] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [dishCategory, setDishCategory] = useState<CategoryId>('fast-food');
  const [dishImage, setDishImage] = useState('');
  const [dishIsVeg, setDishIsVeg] = useState(true);
  const [dishPrepTime, setDishPrepTime] = useState('15-20 min');
  const [dishIsBestseller, setDishIsBestseller] = useState(false);

  // Compute Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' || o.status === 'delivered' ? o.total : 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'delivered').length;

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    const matchesSearch = 
      ord.id.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchOrderQuery);
    return matchesStatus && matchesSearch;
  });

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim() || !dishPrice) return;

    const newItem: FoodItem = {
      id: `custom-${Date.now()}`,
      name: dishName.trim(),
      description: dishDescription.trim() || 'Freshly prepared signature dish cooked with premium ingredients.',
      price: parseFloat(dishPrice) || 9.99,
      category: dishCategory,
      image: dishImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 1,
      isVeg: dishIsVeg,
      isBestseller: dishIsBestseller,
      prepTime: dishPrepTime,
      available: true,
    };

    onAddNewFoodItem(newItem);
    setShowAddDishModal(false);
    // Reset
    setDishName('');
    setDishDescription('');
    setDishPrice('');
    setDishImage('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Admin Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Store Operations & Kitchen Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-white">
            Restaurant Admin Console
          </h1>
          <p className="text-xs sm:text-sm text-stone-400">
            Manage live incoming kitchen orders, update food catalog availability, and track store revenues.
          </p>
        </div>

        <button
          onClick={onCloseAdmin}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors"
        >
          ← Back to Customer Storefront
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Total Store Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-stone-900">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            ● Lifetime gross transactions
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Active Kitchen Orders</span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-orange-600">
            {activeOrdersCount}
          </div>
          <div className="text-[11px] text-orange-600 font-semibold">
            ● In Prep / Out for Delivery
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Completed Deliveries</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-stone-900">
            {deliveredOrdersCount}
          </div>
          <div className="text-[11px] text-stone-400 font-semibold">
            Out of {orders.length} total orders
          </div>
        </div>
      </div>

      {/* Tabs: Orders Management vs Menu Catalog Management */}
      <div className="flex border-b border-stone-200 bg-white rounded-2xl p-1.5 border gap-1">
        <button
          id="admin-tab-orders"
          onClick={() => setAdminTab('orders')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
            adminTab === 'orders'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          📦 Orders Queue & Dispatch ({orders.length})
        </button>

        <button
          id="admin-tab-menu"
          onClick={() => setAdminTab('menu')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
            adminTab === 'menu'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          🍔 Menu Catalog & Stocks ({foodItems.length})
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {adminTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {(['all', 'placed', 'preparing', 'on_the_way', 'delivered'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchOrderQuery}
                onChange={(e) => setSearchOrderQuery(e.target.value)}
                placeholder="Search Order ID / Name..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 text-sm">
                No orders match your filter.
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-stone-900">
                          #{ord.id}
                        </span>
                        <span className="text-xs text-stone-400">
                          • {new Date(ord.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {ord.deliverySpeed === 'express' && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            ⚡ Express
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-stone-700 flex items-center gap-2">
                        <span>{ord.customerName} ({ord.customerPhone})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] text-stone-400 uppercase font-bold">Total Bill</div>
                        <div className="font-mono font-black text-base text-stone-900">
                          ${ord.total.toFixed(2)}
                        </div>
                      </div>

                      {/* Status Selector Dropdown */}
                      <div className="flex items-center gap-1.5 bg-stone-50 p-1 rounded-xl border border-stone-200">
                        <span className="text-[11px] text-stone-500 font-medium pl-1">Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="text-xs font-bold bg-white text-stone-800 py-1 px-2 rounded-lg border border-stone-300 focus:outline-none focus:border-orange-500"
                        >
                          <option value="placed">Placed</option>
                          <option value="preparing">Cooking (Kitchen)</option>
                          <option value="on_the_way">On the Way</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Items Ordered List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200/60 text-xs">
                        <img
                          src={item.item.image}
                          alt={item.item.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-stone-900 truncate">
                            {item.quantity}x {item.item.name}
                          </div>
                          {item.selectedSize && (
                            <div className="text-[10px] text-stone-500">{item.selectedSize.name}</div>
                          )}
                        </div>
                        <span className="font-mono font-bold text-stone-700">${item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Address & Note */}
                  <div className="text-xs text-stone-500 flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div>
                      <strong>Address:</strong> {ord.deliveryAddress.street}, {ord.deliveryAddress.city}
                    </div>
                    {ord.deliveryInstructions && (
                      <div className="italic text-stone-600">
                        <strong>Driver Note:</strong> "{ord.deliveryInstructions}"
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Menu Catalog Management */}
      {adminTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-stone-900">
              Manage Dishes & Availability ({foodItems.length})
            </h3>
            <button
              onClick={() => setShowAddDishModal(true)}
              className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Dish
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodItems.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-3xl p-4 border border-stone-200 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        dish.isVeg ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {dish.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                      <button
                        onClick={() => onDeleteFoodItem(dish.id)}
                        className="text-stone-400 hover:text-red-600 p-0.5"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 truncate mt-1">{dish.name}</h4>
                    <div className="font-mono font-extrabold text-xs text-orange-600 mt-0.5">
                      ${dish.price.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-stone-400 capitalize">{dish.category.replace('-', ' ')}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-600 font-medium">Availability:</span>
                    <button
                      onClick={() => onToggleItemAvailability(dish.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                        dish.available
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600 line-through'
                      }`}
                    >
                      {dish.available ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Add New Dish to Menu</h3>
              <button
                onClick={() => setShowAddDishModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g. Gourmet Crispy Chicken Tacos"
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={dishPrice}
                    onChange={(e) => setDishPrice(e.target.value)}
                    placeholder="9.99"
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={dishCategory}
                    onChange={(e) => setDishCategory(e.target.value as CategoryId)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 font-medium"
                  >
                    <option value="fast-food">Fast Food</option>
                    <option value="pizzas">Pizzas & Pastas</option>
                    <option value="meals-biryani">Meals & Biryani</option>
                    <option value="bakery">Bakery</option>
                    <option value="desserts">Desserts</option>
                    <option value="beverages">Beverages</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={dishImage}
                  onChange={(e) => setDishImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={dishDescription}
                  onChange={(e) => setDishDescription(e.target.value)}
                  placeholder="Describe ingredients, cooking style, and serving..."
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 font-medium"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={dishIsVeg}
                    onChange={(e) => setDishIsVeg(e.target.checked)}
                    className="rounded text-orange-600"
                  />
                  <span>Is Vegetarian</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={dishIsBestseller}
                    onChange={(e) => setDishIsBestseller(e.target.checked)}
                    className="rounded text-orange-600"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
