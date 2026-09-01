import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Wallet, 
  Clock, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Address, CartItem, Order, PromoCoupon, UserProfile } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedPromo: PromoCoupon | null;
  user: UserProfile | null;
  savedAddresses: Address[];
  onAddNewAddress: (address: Omit<Address, 'id'>) => void;
  onPlaceOrder: (orderData: Partial<Order>) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedPromo,
  user,
  savedAddresses,
  onAddNewAddress,
  onPlaceOrder,
}) => {
  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const freeDeliveryThreshold = 25.00;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold || appliedPromo?.code === 'FREESHIP';
  
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const baseDeliveryFee = isFreeDelivery ? 0 : 1.99;
  const expressSurcharge = deliverySpeed === 'express' ? 1.49 : 0;
  const deliveryFee = baseDeliveryFee + expressSurcharge;

  const packagingFee = 1.20;
  const tax = subtotal * 0.05;

  let discount = 0;
  if (appliedPromo && subtotal >= appliedPromo.minOrder) {
    const rawDiscount = (subtotal * appliedPromo.discountPercentage) / 100;
    discount = appliedPromo.maxDiscount ? Math.min(rawDiscount, appliedPromo.maxDiscount) : rawDiscount;
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee + packagingFee + tax);

  // Form states
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses[0]?.id || 'new'
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(savedAddresses.length === 0);

  // Contact Info
  const [customerName, setCustomerName] = useState(user?.name || 'Alex Johnson');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+1 (555) 438-9201');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'alex.j@example.com');
  const [deliveryInstructions, setDeliveryInstructions] = useState('Ring doorbell once and leave on the doorstep.');

  // New Address Fields
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newCity, setNewCity] = useState('Metropolis City');
  const [newPincode, setNewPincode] = useState('400012');
  const [newAddressType, setNewAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card' | 'wallet'>('upi');
  
  // Card input mock states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Loading state during order placement
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;

    onAddNewAddress({
      title: newAddressType,
      street: newStreet.trim(),
      landmark: newLandmark.trim() || undefined,
      city: newCity,
      pincode: newPincode,
      isDefault: false,
    });

    setIsAddingNewAddress(false);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    let targetAddress: Address;
    if (isAddingNewAddress || savedAddresses.length === 0) {
      targetAddress = {
        id: `addr-${Date.now()}`,
        title: newAddressType,
        street: newStreet || '124 Gourmet Boulevard, Suite 5',
        landmark: newLandmark || 'Near City Center',
        city: newCity,
        pincode: newPincode,
      };
    } else {
      const found = savedAddresses.find((a) => a.id === selectedAddressId);
      targetAddress = found || savedAddresses[0];
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onPlaceOrder({
        items,
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress: targetAddress,
        deliverySpeed,
        deliveryInstructions,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        subtotal,
        discount,
        promoCode: appliedPromo?.code,
        deliveryFee,
        tax,
        packagingFee,
        total: grandTotal,
        status: 'placed',
        placedAt: new Date().toISOString(),
        estimatedDeliveryTime: deliverySpeed === 'express' ? '15-20 mins' : '25-30 mins',
        driver: {
          name: 'Michael Vance',
          phone: '+1 (555) 839-2049',
          photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          rating: 4.9,
          vehicle: 'Yamaha NVX Scooter (Silver)',
        },
        orderTimeline: [
          { status: 'placed', time: 'Just now', description: 'Order received and kitchen notified' },
        ],
      });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      
      {/* Modal Container */}
      <div 
        id="checkout-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh] animate-scaleIn"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 font-serif">
                Secure Checkout
              </h2>
              <p className="text-xs text-stone-500">
                Confirm your delivery details and choose your payment method
              </p>
            </div>
          </div>

          <button
            id="checkout-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          
          {/* Step 1: Customer Contact Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-stone-900">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-mono">1</span>
              <span>Contact Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Address Selection */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-extrabold text-stone-900">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-mono">2</span>
                <span>Delivery Address</span>
              </div>

              {savedAddresses.length > 0 && !isAddingNewAddress && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              )}
            </div>

            {/* Saved Address Cards */}
            {!isAddingNewAddress && savedAddresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/70 shadow-xs'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-orange-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">{addr.title}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-semibold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                          {addr.street}
                        </p>
                        {addr.landmark && (
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            Landmark: {addr.landmark}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Add New Address Form */
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">New Address Details</span>
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="text-xs text-stone-500 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddressType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        newAddressType === type
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white text-stone-700 border-stone-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">House / Flat / Street Address *</label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="e.g. Apt 4B, Sunflower Apts, 12th Main Road"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Landmark</label>
                    <input
                      type="text"
                      value={newLandmark}
                      onChange={(e) => setNewLandmark(e.target.value)}
                      placeholder="e.g. Near Metro Station"
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Pincode / Zip *</label>
                    <input
                      type="text"
                      required
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      placeholder="e.g. 400012"
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Instructions Shortcut */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-stone-700 mb-1">Delivery Instructions for Driver</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[
                  'Leave at doorstep',
                  'Do not ring doorbell',
                  'Call upon arrival',
                  'Hand over to security guard',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setDeliveryInstructions(tag)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/80 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="Optional notes for delivery partner..."
                className="w-full px-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Step 3: Delivery Speed Options */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-sm font-extrabold text-stone-900">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-mono">3</span>
              <span>Delivery Speed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setDeliverySpeed('standard')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  deliverySpeed === 'standard'
                    ? 'border-orange-500 bg-orange-50/70 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Standard Delivery</div>
                    <div className="text-[11px] text-stone-500">25 - 30 minutes arrival</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-800">Included</span>
              </div>

              <div
                onClick={() => setDeliverySpeed('express')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  deliverySpeed === 'express'
                    ? 'border-orange-500 bg-orange-50/70 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                      <span>Lightning Express</span>
                      <span className="bg-amber-100 text-amber-800 text-[9px] px-1 rounded font-extrabold uppercase">Fast</span>
                    </div>
                    <div className="text-[11px] text-stone-500">15 - 20 minutes arrival</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-600">+$1.49</span>
              </div>
            </div>
          </div>

          {/* Step 4: Payment Method */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-sm font-extrabold text-stone-900">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-mono">4</span>
              <span>Payment Option</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'upi'
                    ? 'border-orange-500 bg-orange-50/80 text-orange-900 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <QrCode className="w-5 h-5 text-orange-600" />
                <span className="text-xs font-bold">UPI / QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50/80 text-orange-900 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold">Credit / Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'cod'
                    ? 'border-orange-500 bg-orange-50/80 text-orange-900 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold">Cash on Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'wallet'
                    ? 'border-orange-500 bg-orange-50/80 text-orange-900 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <Wallet className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-bold">Digital Wallet</span>
              </button>
            </div>

            {/* Payment Details Subview */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              {paymentMethod === 'upi' && (
                <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
                  <div className="w-24 h-24 bg-white p-2 rounded-xl border border-stone-300 flex items-center justify-center shrink-0 shadow-xs">
                    {/* Simulated QR Code */}
                    <div className="w-full h-full bg-stone-900 rounded flex flex-col justify-between p-1">
                      <div className="flex justify-between">
                        <div className="w-4 h-4 bg-white rounded-xs" />
                        <div className="w-4 h-4 bg-white rounded-xs" />
                      </div>
                      <div className="text-[7px] text-center font-mono text-amber-300 font-bold">SCAN & PAY</div>
                      <div className="flex justify-between">
                        <div className="w-4 h-4 bg-white rounded-xs" />
                        <div className="w-3 h-3 bg-amber-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="font-bold text-stone-900 text-sm">Instant UPI Payment</div>
                    <p className="text-stone-500 leading-relaxed">
                      Scan QR with Google Pay, PhonePe, Paytm, or BHIM. Payment will auto-verify instantly on order submission.
                    </p>
                    <div className="text-[11px] font-mono text-orange-700 font-bold bg-orange-100 inline-block px-2 py-0.5 rounded">
                      UPI ID: zestbite.pay@okhdfcbank
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 font-mono font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 font-mono font-medium focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 font-mono font-medium focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="text-xs text-stone-600 space-y-1">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Pay Cash or UPI on Arrival</span>
                  </div>
                  <p>
                    Please keep exact cash ready or request your delivery rider's QR code upon arrival.
                  </p>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="text-xs text-stone-600 space-y-2">
                  <div className="font-bold text-stone-900">Choose Digital Wallet</div>
                  <div className="flex gap-2">
                    {['Apple Pay', 'Google Wallet', 'Amazon Pay', 'Paytm'].map((w) => (
                      <span key={w} className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg font-medium text-stone-700">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/80 space-y-2 text-xs">
            <div className="flex justify-between font-bold text-stone-900">
              <span>Items Total ({items.length} items)</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Promo Discount ({appliedPromo?.code})</span>
                <span className="font-mono">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee ({deliverySpeed === 'express' ? 'Express 15-20m' : 'Standard'})</span>
              <span className="font-mono">{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Taxes & Packaging</span>
              <span className="font-mono">${(tax + packagingFee).toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-orange-200 flex justify-between items-center text-stone-900 font-black text-sm">
              <span>Grand Total Payable</span>
              <span className="text-base text-orange-600 font-mono">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="checkout-place-order-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-75 text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-orange-500/25 active:scale-98 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Confirming Your Order...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Place Order • ${grandTotal.toFixed(2)}</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
