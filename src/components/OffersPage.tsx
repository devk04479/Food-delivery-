import React, { useState } from 'react';
import { 
  Percent, 
  Copy, 
  Check, 
  Sparkles, 
  Flame, 
  Gift, 
  Clock, 
  Tag,
  ArrowRight
} from 'lucide-react';
import { PromoCoupon } from '../types';

interface OffersPageProps {
  promos: PromoCoupon[];
  onApplyCoupon: (code: string) => void;
  onExploreMenu: () => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({
  promos,
  onApplyCoupon,
  onExploreMenu,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onApplyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const comboDeals = [
    {
      title: 'Burger & Loaded Fries Combo Delight',
      description: 'Double Smoky Cheeseburger + Large Peri-Peri Fries + Cold Pressed Mojito',
      originalPrice: 19.47,
      comboPrice: 14.99,
      saveText: 'Save $4.48',
      tag: '🔥 Popular Combo',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Royal Biryani & Sweet Feast (Serves 2)',
      description: 'Royal Mutton Dum Biryani (Jumbo Handi) + 2 Boiled Spiced Eggs + 2 Lava Cakes',
      originalPrice: 34.49,
      comboPrice: 26.99,
      saveText: 'Save $7.50',
      tag: '👑 Royal Feast',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Artisan Neapolitan Pizza & Garlic Bread',
      description: '12-inch Wild Truffle Pizza + Cheesy Garlic Pull-Apart Bread + 2 Iced Macchiatos',
      originalPrice: 32.46,
      comboPrice: 24.99,
      saveText: 'Save $7.47',
      tag: '🍕 Weekend Saver',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
          <Percent className="w-3.5 h-3.5" />
          <span>Exclusive Savings & Promo Codes</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif tracking-tight">
          Deals, Combos & Promo Coupons
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Apply any coupon code directly to your cart at checkout for instant savings!
        </p>
      </div>

      {/* Promo Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promos.map((promo) => (
          <div
            key={promo.code}
            className="bg-white rounded-3xl p-6 border-2 border-dashed border-orange-300 hover:border-orange-500 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full">
                  {promo.discountPercentage}% DISCOUNT
                </span>
                <span className="text-xs text-stone-400 font-medium font-mono">
                  Min ${promo.minOrder}
                </span>
              </div>

              <h3 className="text-lg font-black text-stone-900 font-serif">
                {promo.title}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {promo.description}
              </p>
            </div>

            {/* Coupon Code Strip */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
              <div className="font-mono font-black text-sm text-stone-900 bg-stone-100 px-3 py-1.5 rounded-xl tracking-wider">
                {promo.code}
              </div>

              <button
                onClick={() => handleCopy(promo.code)}
                className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                {copiedCode === promo.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy & Apply</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Meal Combos Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-stone-900 font-serif tracking-tight">
              Chef Curated Value Combos
            </h2>
            <p className="text-xs text-stone-500">
              Pre-bundled meal pairings designed for maximum flavor and savings
            </p>
          </div>

          <button
            onClick={onExploreMenu}
            className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comboDeals.map((combo, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 w-full bg-stone-100">
                <img
                  src={combo.image}
                  alt={combo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-stone-900/90 text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full backdrop-blur-md">
                  {combo.tag}
                </div>
                <div className="absolute bottom-3 right-3 bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-xl shadow-md">
                  {combo.saveText}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-stone-900">
                    {combo.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {combo.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div>
                    <span className="text-lg font-black text-stone-900 font-mono">
                      ${combo.comboPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-stone-400 line-through ml-2 font-mono">
                      ${combo.originalPrice.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={onExploreMenu}
                    className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    View in Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
