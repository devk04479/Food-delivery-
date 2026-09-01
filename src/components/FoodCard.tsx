import React from 'react';
import { 
  Star, 
  Clock, 
  Flame, 
  Heart, 
  Plus, 
  Minus, 
  Sparkles,
  SlidersHorizontal 
} from 'lucide-react';
import { FoodItem } from '../types';

interface FoodCardProps {
  item: FoodItem;
  quantityInCart: number;
  onAddToCart: (item: FoodItem) => void;
  onRemoveFromCart: (item: FoodItem) => void;
  onOpenDetailModal: (item: FoodItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (itemId: string) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetailModal,
  isFavorite,
  onToggleFavorite,
}) => {
  const hasCustomization = Boolean(
    (item.customization?.sizes && item.customization.sizes.length > 0) ||
    (item.customization?.addOns && item.customization.addOns.length > 0)
  );

  return (
    <div 
      id={`food-card-${item.id}`}
      className="group relative flex flex-col bg-white rounded-3xl border border-stone-200/90 hover:border-orange-300 shadow-2xs hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden"
    >
      {/* Image Container */}
      <div 
        className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100 cursor-pointer"
        onClick={() => onOpenDetailModal(item)}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80" />

        {/* Veg / Non-Veg Indicator Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-1.5 rounded-lg shadow-sm border border-stone-200/60 flex items-center gap-1.5">
          <div className={`w-3.5 h-3.5 border flex items-center justify-center rounded-xs ${item.isVeg ? 'border-emerald-600' : 'border-red-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700">
            {item.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Special Tags (Bestseller, Chef Special) */}
        <div className="absolute top-3 right-12 flex flex-col gap-1 items-end">
          {item.isBestseller && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Bestseller
            </span>
          )}
          {item.isChefSpecial && !item.isBestseller && (
            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider flex items-center gap-1">
              👑 Chef Pick
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          id={`favorite-btn-${item.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorite 
              ? 'bg-red-500 text-white shadow-md' 
              : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60'
          }`}
          aria-label="Add to favorites"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Prep Time & Calories Pill on Image bottom */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-white/90">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>{item.prepTime}</span>
          </div>
          {item.calories && (
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-stone-200">
              <span>{item.calories} kcal</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Rating & Spicy Tag */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-lg border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{item.rating.toFixed(1)}</span>
              <span className="text-stone-400 font-normal">({item.reviewsCount})</span>
            </div>

            {item.isSpicy && (
              <span className="flex items-center gap-0.5 text-orange-600 text-[11px] font-semibold bg-orange-50 px-2 py-0.5 rounded-md">
                <Flame className="w-3 h-3" /> Spicy
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetailModal(item)}
            className="text-base sm:text-lg font-bold text-stone-900 line-clamp-1 group-hover:text-orange-600 transition-colors cursor-pointer"
            title={item.name}
          >
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Bottom Price & Add to Cart Action */}
        <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-stone-900">
                ${item.price.toFixed(2)}
              </span>
              {item.originalPrice && (
                <span className="text-xs text-stone-400 line-through font-medium">
                  ${item.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {item.originalPrice && (
              <span className="text-[10px] font-bold text-emerald-600">
                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Add to Cart / Quantity Controller */}
          <div>
            {quantityInCart > 0 && !hasCustomization ? (
              <div className="flex items-center bg-orange-600 text-white rounded-xl shadow-xs overflow-hidden">
                <button
                  id={`decrement-${item.id}`}
                  onClick={() => onRemoveFromCart(item)}
                  className="p-1.5 hover:bg-orange-700 active:bg-orange-800 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 text-xs font-bold font-mono">{quantityInCart}</span>
                <button
                  id={`increment-${item.id}`}
                  onClick={() => onAddToCart(item)}
                  className="p-1.5 hover:bg-orange-700 active:bg-orange-800 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : hasCustomization ? (
              <button
                id={`customize-btn-${item.id}`}
                onClick={() => onOpenDetailModal(item)}
                className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200/80 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize</span>
                {quantityInCart > 0 && (
                  <span className="bg-orange-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-extrabold ml-0.5">
                    {quantityInCart}
                  </span>
                )}
              </button>
            ) : (
              <button
                id={`add-btn-${item.id}`}
                onClick={() => onAddToCart(item)}
                className="flex items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ADD</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
