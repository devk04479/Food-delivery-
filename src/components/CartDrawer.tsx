import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Percent, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { CartItem, PromoCoupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  appliedPromo: PromoCoupon | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
  availablePromos: PromoCoupon[];
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  availablePromos,
  onProceedToCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Compute pricing
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const freeDeliveryThreshold = 25.00;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold || appliedPromo?.code === 'FREESHIP';
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 1.99;
  const packagingFee = subtotal === 0 ? 0 : 1.20;
  const tax = subtotal * 0.05;

  let discount = 0;
  if (appliedPromo && subtotal >= appliedPromo.minOrder) {
    const rawDiscount = (subtotal * appliedPromo.discountPercentage) / 100;
    discount = appliedPromo.maxDiscount ? Math.min(rawDiscount, appliedPromo.maxDiscount) : rawDiscount;
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee + packagingFee + tax);

  const handleApplyPromoCode = (code: string) => {
    setPromoError(null);
    setPromoSuccessMsg(null);
    const success = onApplyPromo(code);
    if (success) {
      setPromoSuccessMsg(`Coupon "${code}" applied successfully!`);
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon or minimum order requirement not met.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over Drawer */}
      <div 
        id="cart-drawer-container"
        className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-slideLeft"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900 font-serif">
                Your Food Basket
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {items.length} {items.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                id="cart-clear-all-btn"
                onClick={onClearCart}
                className="text-xs text-stone-400 hover:text-red-600 px-2 py-1 rounded-md transition-colors"
              >
                Clear
              </button>
            )}
            <button
              id="cart-close-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Free Delivery Progress Banner */}
        {items.length > 0 && (
          <div className="bg-orange-50 px-4 py-2.5 border-b border-orange-100 shrink-0">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <div className="flex items-center gap-1.5 text-orange-900">
                <Truck className="w-3.5 h-3.5 text-orange-600" />
                <span>
                  {isFreeDelivery 
                    ? '🎉 You unlocked FREE Delivery!' 
                    : `Add $${(freeDeliveryThreshold - subtotal).toFixed(2)} more for FREE delivery`}
                </span>
              </div>
              <span className="text-orange-600">
                {Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100))}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-orange-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Scrollable Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-900">Your basket is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Explore our mouth-watering menu and treat yourself to hot fresh meals!
                </p>
              </div>
              <button
                id="cart-empty-browse-btn"
                onClick={onClose}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((cartItem) => (
                <div
                  key={cartItem.cartItemId}
                  className="p-3 bg-stone-50/80 rounded-2xl border border-stone-200/80 flex gap-3 items-start"
                >
                  {/* Food Image */}
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                  />

                  {/* Item Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1">
                        {cartItem.item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(cartItem.cartItemId)}
                        className="text-stone-400 hover:text-red-500 p-0.5 rounded transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Customizations summary */}
                    <div className="text-[11px] text-stone-500 space-y-0.5">
                      {cartItem.selectedSize && (
                        <div className="text-stone-600 font-medium">
                          Size: {cartItem.selectedSize.name}
                        </div>
                      )}
                      {cartItem.selectedAddOns && cartItem.selectedAddOns.length > 0 && (
                        <div className="truncate text-stone-500">
                          + {cartItem.selectedAddOns.map((a) => a.name).join(', ')}
                        </div>
                      )}
                      {cartItem.selectedSpice && (
                        <div className="text-orange-600 font-medium">
                          🌶️ {cartItem.selectedSpice}
                        </div>
                      )}
                    </div>

                    {/* Price and Quantity Controller */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono font-extrabold text-sm text-stone-900">
                        ${cartItem.totalPrice.toFixed(2)}
                      </span>

                      <div className="flex items-center bg-white rounded-lg border border-stone-200 shadow-2xs overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                          className="px-2 py-1 hover:bg-stone-100 text-stone-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold font-mono text-stone-900">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                          className="px-2 py-1 hover:bg-stone-100 text-stone-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Code Apply Box */}
              <div className="pt-2">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-orange-600" />
                      Apply Promo Coupon
                    </span>
                    {appliedPromo && (
                      <button
                        onClick={onRemovePromo}
                        className="text-[11px] text-red-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {appliedPromo ? (
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>{appliedPromo.code} applied!</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          setPromoError(null);
                        }}
                        placeholder="Enter coupon (e.g. FEAST50)"
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-300 uppercase font-mono font-bold focus:border-orange-500 focus:outline-none bg-white"
                      />
                      <button
                        onClick={() => handleApplyPromoCode(promoInput)}
                        className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <div className="text-[11px] text-red-600 font-medium">{promoError}</div>
                  )}
                  {promoSuccessMsg && (
                    <div className="text-[11px] text-emerald-600 font-medium">{promoSuccessMsg}</div>
                  )}

                  {/* Quick available coupons suggestions */}
                  {!appliedPromo && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {availablePromos.map((p) => (
                        <button
                          key={p.code}
                          onClick={() => handleApplyPromoCode(p.code)}
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-orange-100/80 hover:bg-orange-200 text-orange-800 border border-orange-200 transition-colors"
                        >
                          {p.code} ({p.discountPercentage}%)
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bill Details Breakdown */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <h4 className="font-extrabold text-stone-900 text-xs tracking-tight">
                  Bill Summary
                </h4>
                <div className="space-y-1.5 text-stone-600">
                  <div className="flex justify-between">
                    <span>Item Subtotal</span>
                    <span className="font-mono font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount ({appliedPromo?.code})</span>
                      <span className="font-mono">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-mono">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Restaurant Packaging</span>
                    <span className="font-mono">${packagingFee.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Govt Taxes & GST (5%)</span>
                    <span className="font-mono">${tax.toFixed(2)}</span>
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-stone-900 font-extrabold text-sm">
                    <span>Grand Total</span>
                    <span className="font-mono text-base text-orange-600 font-black">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Bottom Action Bar */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-stone-200 shrink-0 shadow-lg space-y-2">
            <button
              id="cart-proceed-checkout-btn"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full flex items-center justify-between bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-5 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/25 active:scale-98 transition-all cursor-pointer"
            >
              <div className="text-left leading-tight">
                <div className="text-[11px] text-amber-200 uppercase font-semibold">Total to Pay</div>
                <div className="font-mono font-black text-lg">${grandTotal.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <span>Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure 256-Bit Encrypted Payment</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
