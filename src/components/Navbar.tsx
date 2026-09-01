import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  MapPin, 
  Clock, 
  Menu as MenuIcon, 
  X, 
  ShieldCheck, 
  Percent, 
  Utensils, 
  Info,
  ChevronDown,
  CalendarCheck
} from 'lucide-react';
import { Address, UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'menu' | 'offers' | 'about' | 'orders' | 'admin' | 'book-table';
  setActiveTab: (tab: 'home' | 'menu' | 'offers' | 'about' | 'orders' | 'admin' | 'book-table') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  user: UserProfile | null;
  onOpenUserModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedAddress: Address | null;
  onSelectAddressModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  onOpenCart,
  favoritesCount,
  onOpenFavorites,
  user,
  onOpenUserModal,
  searchQuery,
  setSearchQuery,
  selectedAddress,
  onSelectAddressModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-2 sm:top-3 z-40 px-3 sm:px-6 w-full flex justify-center transition-all">
      {/* Compact Main Header Floating Capsule */}
      <div className="w-full max-w-5xl bg-stone-950/95 backdrop-blur-xl border border-stone-800 shadow-[0_12px_35px_rgba(0,0,0,0.7)] rounded-2xl sm:rounded-full px-3.5 sm:px-5 py-2 transition-all text-white">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* 1. Logo & Brand Text inside Header */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="brand-logo-btn"
              onClick={() => { setActiveTab('home'); }}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform shrink-0">
                <Utensils className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white font-serif">ZestBite</span>
                  <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Fresh</span>
                </div>
                <span className="text-[10px] text-stone-400 font-medium hidden md:block mt-0.5">Gourmet Food & Fast Delivery</span>
              </div>
            </button>
          </div>

          {/* 2. Search Bar inside Header */}
          <div className="flex-1 max-w-xs lg:max-w-sm hidden sm:block">
            <div className={`relative flex items-center w-full transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-amber-500/40' : ''}`}>
              <Search className="absolute left-3 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
              <input
                id="main-nav-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search food, burgers, biryani..."
                className="w-full bg-stone-900/90 hover:bg-stone-850 focus:bg-stone-900 text-white placeholder:text-stone-500 pl-8 pr-8 py-1.5 rounded-full text-xs sm:text-sm border border-stone-800 focus:border-amber-500 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-stone-400 hover:text-stone-200 text-xs bg-stone-800 hover:bg-stone-700 w-3.5 h-3.5 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>

          {/* 3. Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-stone-300">
            <button
              id="nav-link-home"
              onClick={() => setActiveTab('home')}
              className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${activeTab === 'home' ? 'text-amber-400 bg-amber-500/15 font-bold border border-amber-500/30' : 'hover:text-white hover:bg-stone-900'}`}
            >
              Home
            </button>
            <button
              id="nav-link-menu"
              onClick={() => setActiveTab('menu')}
              className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${activeTab === 'menu' ? 'text-amber-400 bg-amber-500/15 font-bold border border-amber-500/30' : 'hover:text-white hover:bg-stone-900'}`}
            >
              Menu
            </button>
            <button
              id="nav-link-book-table"
              onClick={() => setActiveTab('book-table')}
              className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer ${activeTab === 'book-table' ? 'text-amber-400 bg-amber-500/15 font-bold border border-amber-500/30' : 'hover:text-white hover:bg-stone-900'}`}
            >
              <CalendarCheck className="w-3 h-3 text-amber-400" />
              <span>Book Table</span>
            </button>
            <button
              id="nav-link-offers"
              onClick={() => setActiveTab('offers')}
              className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer ${activeTab === 'offers' ? 'text-amber-400 bg-amber-500/15 font-bold border border-amber-500/30' : 'hover:text-white hover:bg-stone-900'}`}
            >
              <Percent className="w-3 h-3 text-amber-400" />
              <span>Offers</span>
            </button>
            <button
              id="nav-link-orders"
              onClick={() => setActiveTab('orders')}
              className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${activeTab === 'orders' ? 'text-amber-400 bg-amber-500/15 font-bold border border-amber-500/30' : 'hover:text-white hover:bg-stone-900'}`}
            >
              Orders
            </button>
            <button
              id="nav-link-about"
              onClick={() => setActiveTab('about')}
              className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${activeTab === 'about' ? 'text-amber-400 bg-amber-500/15 font-bold border border-amber-500/30' : 'hover:text-white hover:bg-stone-900'}`}
            >
              About
            </button>
          </nav>

          {/* 4. Action Buttons (Favorites, Cart, Account, Mobile Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Favorites Icon */}
            <button
              id="nav-favorites-btn"
              onClick={onOpenFavorites}
              className="relative p-1.5 sm:p-2 rounded-full text-stone-300 hover:text-red-400 hover:bg-stone-900 transition-colors cursor-pointer"
              title="Saved Favorites"
            >
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {favoritesCount > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-scaleIn">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black px-3 py-1.5 rounded-full font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <div className="relative">
                <ShoppingBag className="w-3.5 h-3.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-amber-400 border border-amber-400 font-extrabold rounded-full w-3.5 h-3.5 text-[9px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-black">
                {cartTotal > 0 ? `$${cartTotal.toFixed(2)}` : 'Cart'}
              </span>
            </button>

            {/* User Account / Profile */}
            <button
              id="nav-user-account-btn"
              onClick={onOpenUserModal}
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border border-stone-800 bg-stone-900 hover:bg-stone-850 text-stone-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline max-w-[75px] truncate text-xs">
                {user ? user.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-stone-900 lg:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Search input (screens < 640px) */}
        <div className="pt-2 pb-0.5 sm:hidden">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3 w-3.5 h-3.5 text-stone-500 pointer-events-none" />
            <input
              id="mobile-nav-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, burgers, biryani..."
              className="w-full bg-stone-900 text-white placeholder:text-stone-500 pl-8 pr-7 py-1.5 rounded-full text-xs border border-stone-800 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                id="clear-mobile-search-btn"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-stone-400 text-xs bg-stone-800 w-3.5 h-3.5 rounded-full flex items-center justify-center cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full max-w-5xl mt-2 border border-stone-800 bg-stone-950/98 backdrop-blur-xl rounded-2xl px-4 pt-3 pb-5 space-y-2 shadow-2xl animate-fadeIn">
          <div 
            onClick={onSelectAddressModal}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs cursor-pointer mb-2 text-white"
          >
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex-1 truncate">
              <span className="font-semibold text-stone-200">
                {selectedAddress ? `${selectedAddress.title}: ${selectedAddress.street}` : 'Downtown Delivery'}
              </span>
              <p className="text-stone-400 text-[10px]">Estimated time: 25-30 mins</p>
            </div>
            <span className="text-amber-400 font-bold text-[11px]">Change</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left transition-colors ${activeTab === 'home' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40' : 'bg-stone-900 text-stone-300 border border-stone-800'}`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => { setActiveTab('menu'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left transition-colors ${activeTab === 'menu' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40' : 'bg-stone-900 text-stone-300 border border-stone-800'}`}
            >
              🍔 Full Menu
            </button>
            <button
              onClick={() => { setActiveTab('book-table'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left transition-colors ${activeTab === 'book-table' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40' : 'bg-stone-900 text-stone-300 border border-stone-800'}`}
            >
              🍷 Book Dine Table
            </button>
            <button
              onClick={() => { setActiveTab('offers'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left transition-colors ${activeTab === 'offers' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40' : 'bg-stone-900 text-stone-300 border border-stone-800'}`}
            >
              🎉 Special Offers
            </button>
            <button
              onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left transition-colors ${activeTab === 'orders' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40' : 'bg-stone-900 text-stone-300 border border-stone-800'}`}
            >
              📦 Track Orders
            </button>
            <button
              onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left transition-colors ${activeTab === 'about' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40' : 'bg-stone-900 text-stone-300 border border-stone-800'}`}
            >
              ℹ️ About & Contact
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left transition-colors ${activeTab === 'admin' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40' : 'bg-stone-900 text-stone-300 border border-stone-800'}`}
            >
              ⚙️ Admin Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
