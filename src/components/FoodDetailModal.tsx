import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Clock, 
  Flame, 
  Plus, 
  Minus, 
  Heart, 
  MessageSquare, 
  Send, 
  Check, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { FoodItem, CustomizationOption, Review } from '../types';

interface FoodDetailModalProps {
  item: FoodItem | null;
  onClose: () => void;
  onAddToCartWithOptions: (
    item: FoodItem,
    quantity: number,
    selectedSize?: CustomizationOption,
    selectedAddOns?: CustomizationOption[],
    selectedSpice?: string,
    specialInstructions?: string
  ) => void;
  isFavorite: boolean;
  onToggleFavorite: (itemId: string) => void;
  reviews: Review[];
  onAddReview: (review: { itemId: string; userName: string; rating: number; comment: string }) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  item,
  onClose,
  onAddToCartWithOptions,
  isFavorite,
  onToggleFavorite,
  reviews,
  onAddReview,
}) => {
  if (!item) return null;

  // Customization state
  const [selectedSize, setSelectedSize] = useState<CustomizationOption | undefined>(
    item.customization?.sizes?.[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<CustomizationOption[]>([]);
  const [selectedSpice, setSelectedSpice] = useState<string | undefined>(
    item.customization?.spiceLevels?.[0]
  );
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reviews tab & form state
  const [activeTab, setActiveTab] = useState<'customize' | 'reviews'>('customize');
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const itemReviews = reviews.filter((r) => r.itemId === item.id);

  // Toggle add-on
  const toggleAddOn = (addOn: CustomizationOption) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.name === addOn.name);
      if (exists) {
        return prev.filter((a) => a.name !== addOn.name);
      } else {
        return [...prev, addOn];
      }
    });
  };

  // Calculate dynamic unit price and total price
  const sizePrice = selectedSize ? selectedSize.price : 0;
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = item.price + sizePrice + addOnsTotal;
  const grandTotal = unitPrice * quantity;

  const handleAddToCart = () => {
    onAddToCartWithOptions(
      item,
      quantity,
      selectedSize,
      selectedAddOns,
      selectedSpice,
      specialInstructions
    );
    onClose();
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newComment.trim()) return;

    onAddReview({
      itemId: item.id,
      userName: newReviewerName.trim(),
      rating: newRating,
      comment: newComment.trim(),
    });

    setNewReviewerName('');
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      
      {/* Modal Card */}
      <div 
        id="food-detail-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Image Hero Banner */}
        <div className="relative h-60 sm:h-72 w-full bg-stone-900 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          {/* Close Button */}
          <button
            id="food-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all z-10"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Favorite Button */}
          <button
            id={`food-modal-fav-${item.id}`}
            onClick={() => onToggleFavorite(item.id)}
            className={`absolute top-4 right-15 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all z-10 ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-black/60 text-white hover:bg-black/80'
            }`}
            aria-label="Add to favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Badges on Image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  item.isVeg ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                </span>
                {item.isBestseller && (
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Bestseller
                  </span>
                )}
                {item.isSpicy && (
                  <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Spicy
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight drop-shadow-sm">
                {item.name}
              </h2>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs text-stone-300 font-medium">Starting from</div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                ${item.price.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Customization vs Customer Reviews) */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 sm:px-6">
          <button
            id="tab-btn-customize"
            onClick={() => setActiveTab('customize')}
            className={`py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'customize'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Customization & Details
          </button>
          <button
            id="tab-btn-reviews"
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews ({itemReviews.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {activeTab === 'customize' ? (
            <div className="space-y-6">
              
              {/* Description & Quick Stats */}
              <div className="space-y-3">
                <p className="text-stone-600 text-sm leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-stone-600">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{item.rating.toFixed(1)} rating</span>
                  </div>
                  <div className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                    <Clock className="w-4 h-4 text-stone-500" />
                    <span>Prep Time: {item.prepTime}</span>
                  </div>
                  {item.calories && (
                    <div className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                      ⚡ {item.calories} Calories
                    </div>
                  )}
                </div>
              </div>

              {/* Size Selector */}
              {item.customization?.sizes && item.customization.sizes.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-extrabold text-stone-900">
                      Select Portion Size <span className="text-orange-600">*</span>
                    </label>
                    <span className="text-xs text-stone-400">Choose one</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.customization.sizes.map((size) => {
                      const isSelected = selectedSize?.name === size.name;
                      return (
                        <button
                          key={size.name}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`flex items-center justify-between p-3 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50/80 text-stone-900 shadow-xs'
                              : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-orange-600 bg-orange-600' : 'border-stone-300'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="font-bold">{size.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-orange-600">
                            {size.price > 0 ? `+$${size.price.toFixed(2)}` : 'Standard'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Spice Level Selector */}
              {item.customization?.spiceLevels && item.customization.spiceLevels.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-extrabold text-stone-900">
                      Spice Level Preference
                    </label>
                    <span className="text-xs text-stone-400">Customize heat</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.customization.spiceLevels.map((lvl) => {
                      const isSelected = selectedSpice === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSelectedSpice(lvl)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add-Ons / Toppings */}
              {item.customization?.addOns && item.customization.addOns.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-extrabold text-stone-900">
                      Extra Add-Ons & Dips
                    </label>
                    <span className="text-xs text-stone-400">Optional toppings</span>
                  </div>
                  <div className="space-y-2">
                    {item.customization.addOns.map((addOn) => {
                      const isChecked = selectedAddOns.some((a) => a.name === addOn.name);
                      return (
                        <div
                          key={addOn.name}
                          onClick={() => toggleAddOn(addOn)}
                          className={`flex items-center justify-between p-3 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
                            isChecked
                              ? 'border-orange-500 bg-orange-50/50 text-stone-900'
                              : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${isChecked ? 'bg-orange-600 border-orange-600 text-white' : 'border-stone-300 bg-white'}`}>
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <span className="font-medium">{addOn.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-stone-800">
                            +${addOn.price.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Cooking Instructions */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-sm font-extrabold text-stone-900">
                  Special Kitchen Request
                </label>
                <textarea
                  id="food-special-instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra crispy fries, no onions, pack sauce separately..."
                  rows={2}
                  className="w-full p-3 rounded-2xl border border-stone-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none placeholder:text-stone-400"
                />
              </div>
            </div>
          ) : (
            /* Reviews & Rating Screen */
            <div className="space-y-6">
              
              {/* Existing Reviews List */}
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-stone-900">
                  Customer Experiences ({itemReviews.length})
                </h3>
                {itemReviews.length === 0 ? (
                  <div className="p-6 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-sm">
                    No reviews yet for this dish. Be the first to share your taste review!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {itemReviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-200 text-orange-800 font-bold flex items-center justify-center text-xs">
                              {rev.userName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-stone-900">{rev.userName}</div>
                              <div className="text-[10px] text-stone-400">{rev.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Review Form */}
              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/80 space-y-3">
                <h4 className="text-sm font-extrabold text-stone-900">
                  Write Your Review
                </h4>
                {reviewSubmitted && (
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Thank you! Your review has been added.
                  </div>
                )}
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={newReviewerName}
                      onChange={(e) => setNewReviewerName(e.target.value)}
                      placeholder="e.g. Sarah J."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Rating</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-stone-300'}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-stone-700 ml-2">{newRating} Stars</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Your Comment</label>
                    <textarea
                      required
                      rows={2}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="How was the flavor, portion size, and presentation?"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Fixed Action Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex items-center justify-between gap-4 shrink-0 shadow-lg">
          {/* Quantity selector */}
          <div className="flex items-center bg-stone-100 rounded-2xl border border-stone-200 p-1">
            <button
              id="modal-qty-minus"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-extrabold text-stone-900 font-mono text-sm">
              {quantity}
            </span>
            <button
              id="modal-qty-plus"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Main Add to Cart Button */}
          <button
            id="modal-add-to-cart-btn"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-between bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-5 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/25 active:scale-98 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Basket</span>
            </div>
            <span className="font-mono font-black text-amber-200">
              ${grandTotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
