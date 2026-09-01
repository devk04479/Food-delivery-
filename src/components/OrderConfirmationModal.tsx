import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Bike, 
  ChefHat, 
  PackageCheck, 
  ShoppingBag, 
  ChevronRight, 
  X, 
  FileText, 
  RefreshCw,
  Star,
  Sparkles
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderConfirmationModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onViewMyOrders: () => void;
  onReorder: (order: Order) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
  onViewMyOrders,
  onReorder,
}) => {
  if (!isOpen || !order) return null;

  // Status simulation: user can simulate the stage progression or see real progress!
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status || 'placed');
  const [timerSeconds, setTimerSeconds] = useState(25 * 60); // 25 mins

  useEffect(() => {
    setCurrentStatus(order.status || 'placed');
  }, [order.status]);

  // Live countdown timer
  useEffect(() => {
    if (currentStatus === 'delivered') return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStatus]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const statusSteps: { key: OrderStatus; label: string; icon: any; desc: string }[] = [
    {
      key: 'placed',
      label: 'Order Placed',
      icon: ShoppingBag,
      desc: 'Restaurant received your order request',
    },
    {
      key: 'preparing',
      label: 'Kitchen Cooking',
      icon: ChefHat,
      desc: 'Chef is grilling and assembling fresh ingredients',
    },
    {
      key: 'on_the_way',
      label: 'On the Way',
      icon: Bike,
      desc: 'Delivery partner has picked up your hot food',
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: PackageCheck,
      desc: 'Enjoy your delicious meal! Bon appétit',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
      case 'confirmed':
        return 0;
      case 'preparing':
        return 1;
      case 'on_the_way':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const activeStepIdx = getStepIndex(currentStatus);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      
      <div 
        id="order-tracking-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh] animate-scaleIn"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white text-center relative shrink-0">
          <button
            id="order-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-lg">
            <CheckCircle2 className="w-8 h-8 text-amber-200" />
          </div>

          <div className="inline-block bg-white/20 text-amber-200 px-3 py-0.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider mb-1">
            Order #{order.id}
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-serif tracking-tight">
            {currentStatus === 'delivered' ? 'Order Successfully Delivered!' : 'Order Placed & Confirmed!'}
          </h2>
          <p className="text-xs text-orange-100 mt-1 max-w-sm mx-auto">
            Sit back and relax. Your hot meal is being prepared with utmost care.
          </p>

          {/* Delivery Countdown Card */}
          {currentStatus !== 'delivered' && (
            <div className="mt-4 inline-flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-md">
              <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
              <div className="text-left text-xs">
                <span className="text-stone-300">Estimated Delivery: </span>
                <span className="font-mono font-black text-amber-300 text-sm">
                  {formatTimer(timerSeconds)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          
          {/* Interactive Live Status Stepper */}
          <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Live Order Journey
              </h3>
              {/* Simulation status quick switch (for demo) */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-stone-400">Simulate:</span>
                {(['placed', 'preparing', 'on_the_way', 'delivered'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setCurrentStatus(st)}
                    className={`text-[9px] px-1.5 py-0.5 rounded capitalize font-bold ${
                      currentStatus === st ? 'bg-orange-600 text-white' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Stepper nodes */}
            <div className="space-y-4 relative">
              {statusSteps.map((step, idx) => {
                const isPassed = idx <= activeStepIdx;
                const isCurrent = idx === activeStepIdx;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="flex items-start gap-3.5 relative">
                    {/* Vertical line connecting nodes */}
                    {idx < statusSteps.length - 1 && (
                      <div 
                        className={`absolute left-4 top-8 w-0.5 h-10 transition-colors ${
                          idx < activeStepIdx ? 'bg-orange-500' : 'bg-stone-200'
                        }`}
                      />
                    )}

                    {/* Step Icon circle */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                      isCurrent
                        ? 'bg-orange-600 text-white ring-4 ring-orange-100 shadow-md scale-110'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-400'
                    }`}>
                      <StepIcon className="w-4 h-4" />
                    </div>

                    {/* Step description */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isPassed ? 'text-stone-900' : 'text-stone-400'}`}>
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full animate-pulse">
                            Active Step
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Driver & Contact Card */}
          {order.driver && (
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={order.driver.photo}
                  alt={order.driver.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-stone-900">{order.driver.name}</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {order.driver.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">{order.driver.vehicle}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">● Vaccinated & Thermal Checked</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${order.driver.phone}`}
                  onClick={(e) => { e.preventDefault(); alert(`Calling driver at ${order.driver?.phone}`); }}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors"
                  title="Call Delivery Partner"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Delivery Address & Speed */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-stone-800 font-bold">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Delivering to {order.deliveryAddress.title}</span>
            </div>
            <p className="text-stone-600 pl-6 leading-relaxed">
              {order.deliveryAddress.street}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
            </p>
            {order.deliveryInstructions && (
              <p className="text-stone-500 pl-6 italic text-[11px]">
                Note: "{order.deliveryInstructions}"
              </p>
            )}
          </div>

          {/* Ordered Food Items List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Ordered Dishes ({order.items.length})
            </h4>

            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.item.image}
                      alt={item.item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-stone-900">
                        {item.quantity}x {item.item.name}
                      </div>
                      {item.selectedSize && (
                        <div className="text-[11px] text-stone-500">{item.selectedSize.name}</div>
                      )}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Bill Summary */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="font-mono">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promo Discount ({order.promoCode || 'SAVINGS'})</span>
                <span className="font-mono">-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Partner Fee</span>
              <span className="font-mono">{order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Restaurant Packaging</span>
              <span className="font-mono">${(order.tax + order.packagingFee).toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-stone-900 font-extrabold text-sm">
              <span>Total Paid via {order.paymentMethod.toUpperCase()}</span>
              <span className="font-mono text-base text-orange-600 font-black">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Buttons */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <button
            id="order-reorder-btn"
            onClick={() => onReorder(order)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reorder Same Items</span>
          </button>

          <button
            id="order-view-my-orders-btn"
            onClick={() => {
              onClose();
              onViewMyOrders();
            }}
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Go to My Orders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
