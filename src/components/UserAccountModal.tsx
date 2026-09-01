import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  Plus, 
  Trash2, 
  LogOut, 
  Check, 
  ArrowRight,
  Clock,
  Sparkles,
  Package
} from 'lucide-react';
import { Address, FoodItem, Order, UserProfile } from '../types';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogin: (name: string, email: string, phone: string) => void;
  onLogout: () => void;
  orders: Order[];
  onTrackOrder: (order: Order) => void;
  onReorder: (order: Order) => void;
  savedAddresses: Address[];
  onAddNewAddress: (address: Omit<Address, 'id'>) => void;
  onDeleteAddress: (addressId: string) => void;
  favoriteItems: FoodItem[];
  onAddToCart: (item: FoodItem) => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  orders,
  onTrackOrder,
  onReorder,
  savedAddresses,
  onAddNewAddress,
  onDeleteAddress,
  favoriteItems,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'favorites'>('profile');
  
  // Login form state
  const [loginName, setLoginName] = useState('Alex Johnson');
  const [loginEmail, setLoginEmail] = useState('alex.j@example.com');
  const [loginPhone, setLoginPhone] = useState('+1 (555) 438-9201');
  const [isSignUp, setIsSignUp] = useState(false);

  // Address creation inside profile
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newTitle, setNewTitle] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPincode, setNewPincode] = useState('400012');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName || !loginEmail) return;
    onLogin(loginName, loginEmail, loginPhone);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;

    onAddNewAddress({
      title: newTitle,
      street: newStreet.trim(),
      landmark: newLandmark.trim() || undefined,
      city: 'Metropolis City',
      pincode: newPincode,
    });

    setNewStreet('');
    setNewLandmark('');
    setIsAddingAddress(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      
      <div 
        id="user-account-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh] animate-scaleIn"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-orange-500/20">
              {user ? user.name.charAt(0) : <User className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 font-serif">
                {user ? user.name : 'Account & Orders'}
              </h2>
              <p className="text-xs text-stone-500">
                {user ? user.email : 'Sign in to track orders, manage saved addresses & rewards'}
              </p>
            </div>
          </div>

          <button
            id="user-modal-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If Not Logged In, Show Quick Login/Signup */}
        {!user ? (
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-stone-900">
                {isSignUp ? 'Create your ZestBite Account' : 'Welcome back to ZestBite!'}
              </h3>
              <p className="text-xs text-stone-500">
                Get member-only discounts, fast checkout, and real-time tracking
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="+1 (555) 438-9201"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 active:scale-98 transition-all cursor-pointer"
              >
                {isSignUp ? 'Create Account' : 'Sign In Now'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-orange-600 font-bold hover:underline"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Logged In View: Tabs for Profile, Orders, Addresses, Favorites */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Nav Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-50 px-4 sm:px-6 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-3 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'border-orange-600 text-orange-600 bg-white'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-3 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'border-orange-600 text-orange-600 bg-white'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>My Orders ({orders.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`py-3 px-3 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'addresses'
                    ? 'border-orange-600 text-orange-600 bg-white'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Saved Addresses ({savedAddresses.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-3 px-3 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'favorites'
                    ? 'border-orange-600 text-orange-600 bg-white'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-red-500" />
                <span>Favorites ({favoriteItems.length})</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              
              {/* Profile Details Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Contact Details</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Active Member</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-stone-400">Full Name</div>
                        <div className="font-bold text-stone-900 text-sm mt-0.5">{user.name}</div>
                      </div>
                      <div>
                        <div className="text-stone-400">Email Address</div>
                        <div className="font-bold text-stone-900 text-sm mt-0.5">{user.email}</div>
                      </div>
                      <div>
                        <div className="text-stone-400">Phone Number</div>
                        <div className="font-bold text-stone-900 text-sm mt-0.5">{user.phone}</div>
                      </div>
                      <div>
                        <div className="text-stone-400">Total Lifetime Orders</div>
                        <div className="font-bold text-orange-600 text-sm mt-0.5 font-mono">{orders.length} orders</div>
                      </div>
                    </div>
                  </div>

                  {/* Member Perks Box */}
                  <div className="p-4 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 rounded-2xl border border-orange-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-orange-900 font-bold">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                      <span>ZestBite Gold Club Member</span>
                    </div>
                    <p className="text-stone-600">
                      You enjoy priority kitchen prep, early access to new menu launches, and exclusive weekend coupons.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={onLogout}
                      className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <Package className="w-10 h-10 text-stone-400 mx-auto" />
                      <h4 className="font-bold text-stone-800 text-sm">No Orders Yet</h4>
                      <p className="text-xs text-stone-500">Your past ordered dishes will appear right here.</p>
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div key={ord.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-2.5">
                          <div>
                            <div className="text-xs font-mono font-bold text-stone-900">
                              Order #{ord.id}
                            </div>
                            <div className="text-[11px] text-stone-400">
                              {new Date(ord.placedAt).toLocaleDateString()} at {new Date(ord.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'on_the_way'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {ord.status.replace('_', ' ')}
                            </span>
                            <span className="font-mono font-black text-sm text-stone-900">
                              ${ord.total.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="space-y-1 text-xs text-stone-600">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{it.quantity}x {it.item.name}</span>
                              <span className="font-mono">${it.totalPrice.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-200/80">
                          <button
                            onClick={() => {
                              onClose();
                              onTrackOrder(ord);
                            }}
                            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                          >
                            <span>Live Track / Receipt</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => {
                              onReorder(ord);
                              onClose();
                            }}
                            className="text-xs font-bold bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 px-3 py-1.5 rounded-xl transition-colors"
                          >
                            Reorder All
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Saved Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      My Delivery Addresses
                    </h3>
                    {!isAddingAddress && (
                      <button
                        onClick={() => setIsAddingAddress(true)}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Address
                      </button>
                    )}
                  </div>

                  {isAddingAddress && (
                    <form onSubmit={handleCreateAddress} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">New Address</span>
                        <button
                          type="button"
                          onClick={() => setIsAddingAddress(false)}
                          className="text-xs text-stone-400 hover:text-stone-600"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="flex gap-2">
                        {(['Home', 'Work', 'Other'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNewTitle(t)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${
                              newTitle === t ? 'bg-orange-600 text-white' : 'bg-white border border-stone-200 text-stone-700'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={newStreet}
                          onChange={(e) => setNewStreet(e.target.value)}
                          placeholder="e.g. Flat 301, Palm Grove, 5th Avenue"
                          className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">Landmark</label>
                          <input
                            type="text"
                            value={newLandmark}
                            onChange={(e) => setNewLandmark(e.target.value)}
                            placeholder="e.g. Near Star Mall"
                            className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">Zip Code</label>
                          <input
                            type="text"
                            required
                            value={newPincode}
                            onChange={(e) => setNewPincode(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl"
                      >
                        Save Address
                      </button>
                    </form>
                  )}

                  <div className="space-y-3">
                    {savedAddresses.map((addr) => (
                      <div key={addr.id} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-orange-100 text-orange-600 shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900">{addr.title}</div>
                            <p className="text-xs text-stone-600 mt-0.5">{addr.street}</p>
                            {addr.landmark && <p className="text-[11px] text-stone-400">Landmark: {addr.landmark}</p>}
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteAddress(addr.id)}
                          className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div className="space-y-3">
                  {favoriteItems.length === 0 ? (
                    <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <Heart className="w-10 h-10 text-stone-400 mx-auto" />
                      <h4 className="font-bold text-stone-800 text-sm">No Saved Favorites</h4>
                      <p className="text-xs text-stone-500">Tap the heart icon on any dish card to quickly access it here!</p>
                    </div>
                  ) : (
                    favoriteItems.map((fav) => (
                      <div key={fav.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={fav.image}
                            alt={fav.name}
                            className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-stone-900">{fav.name}</h4>
                            <span className="font-mono font-bold text-xs text-orange-600">
                              ${fav.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => onAddToCart(fav)}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-2xs"
                        >
                          + Add to Cart
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
