import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import banner1 from '../assets/images/pizza_offer_banner_1787934054365.jpg';
import banner2 from '../assets/images/weekly_pizza_banner_1787934086182.jpg';
import banner3 from '../assets/images/delicious_pizza_banner_1787934105065.jpg';

interface HeroSliderProps {
  onExploreCategory?: (category: string) => void;
  onApplyCouponCode?: (code: string) => void;
  onOrderNow?: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onExploreCategory,
  onOrderNow,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<number>(1); // 1 = next (right-to-left), -1 = prev (left-to-right)
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      title: 'Hot & Fresh Pizza Special Offer',
      offer: 'Up to 35% OFF',
      image: banner1,
      targetCategory: 'fast-food',
    },
    {
      id: 2,
      title: 'Weekly Pizza Special - Beef Mushroom Sausage',
      offer: 'Special Deal at $25',
      image: banner2,
      targetCategory: 'fast-food',
    },
    {
      id: 3,
      title: 'Delicious Gourmet Oven-Baked Pizza',
      offer: 'Order Now Fresh & Hot',
      image: banner3,
      targetCategory: 'fast-food',
    },
  ];

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentSlide((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % slides.length;
      }
      return prev === 0 ? slides.length - 1 : prev - 1;
    });
  }, [slides.length]);

  // Auto slide with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, paginate]);

  const handleSlideClick = (category: string) => {
    if (category && onExploreCategory) {
      onExploreCategory(category);
    } else if (onOrderNow) {
      onOrderNow();
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  const current = slides[currentSlide];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-3">
      {/* Visual Slider Box with Slide Animation */}
      <div 
        id="hero-visual-slider"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative overflow-hidden rounded-3xl bg-stone-950 shadow-2xl h-[260px] sm:h-[350px] md:h-[420px] lg:h-[480px] w-full flex items-center border border-stone-800/80 group select-none cursor-pointer"
      >
        {/* Animated Slide Banners */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            onClick={() => handleSlideClick(current.targetCategory)}
            className="absolute inset-0 w-full h-full cursor-pointer"
          >
            <img
              src={current.image}
              alt={current.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform group-hover:scale-103 transition-transform duration-700 ease-out"
            />
            {/* Ambient subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next Slide Controls */}
        <button
          id="hero-slider-prev-btn"
          onClick={(e) => {
            e.stopPropagation();
            paginate(-1);
          }}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all z-30 cursor-pointer shadow-xl active:scale-90 opacity-90 group-hover:opacity-100"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          id="hero-slider-next-btn"
          onClick={(e) => {
            e.stopPropagation();
            paginate(1);
          }}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all z-30 cursor-pointer shadow-xl active:scale-90 opacity-90 group-hover:opacity-100"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Indicator Dots & Counter */}
        <div className="absolute bottom-4 right-6 flex items-center gap-2 z-30 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide ? 'w-7 bg-orange-500 shadow-md shadow-orange-500/60' : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
          <span className="text-[11px] font-mono text-stone-300 ml-1 font-semibold">
            0{currentSlide + 1}/0{slides.length}
          </span>
        </div>
      </div>
    </div>
  );
};



