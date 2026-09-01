import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  MessageCircle, 
  Flame, 
  Award, 
  UtensilsCrossed, 
  Calendar, 
  Users, 
  Utensils, 
  Wine, 
  HeartHandshake, 
  ArrowRight,
  Sparkle
} from 'lucide-react';
import { TableReservation } from '../types';

interface TableBookingSectionProps {
  onSuccessToast?: (msg: string) => void;
}

export const TableBookingSection: React.FC<TableBookingSectionProps> = ({
  onSuccessToast,
}) => {
  // Booking Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('08:00 PM');
  const [seatingArea, setSeatingArea] = useState<'indoor' | 'terrace' | 'vip' | 'chef-counter' | 'candlelight'>('indoor');
  const [occasion, setOccasion] = useState('Casual Dining');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);

  // Time Slots
  const lunchSlots = ['12:00 PM', '12:45 PM', '01:30 PM', '02:15 PM', '03:00 PM'];
  const dinnerSlots = ['07:00 PM', '07:45 PM', '08:30 PM', '09:15 PM', '10:00 PM', '10:45 PM'];

  // Seating Options
  const seatingOptions = [
    {
      id: 'indoor',
      title: 'Main Dining Hall',
      desc: 'Ambient lighting & plush velvet seating',
      icon: Utensils,
      badge: 'Popular',
    },
    {
      id: 'terrace',
      title: 'Open Garden Terrace',
      desc: 'Al fresco dining under the night stars',
      icon: Flame,
      badge: 'Scenic',
    },
    {
      id: 'vip',
      title: 'Private VIP Lounge',
      desc: 'Dedicated butler & private booth',
      icon: Wine,
      badge: 'Exclusive',
    },
    {
      id: 'candlelight',
      title: 'Romantic Candlelight',
      desc: 'Corner table with roses & soft candles',
      icon: HeartHandshake,
      badge: 'Couples',
    },
  ];

  // Schedule details
  const scheduleDays = [
    {
      days: 'Monday – Thursday',
      tag: 'Regular Service',
      lunch: '12:00 PM – 04:00 PM',
      dinner: '06:30 PM – 11:00 PM',
      highlight: 'Full A La Carte & Fresh Gourmet Grill',
      status: 'Open Today',
      accent: 'border-stone-800 hover:border-amber-500/40'
    },
    {
      days: 'Friday & Saturday',
      tag: 'Weekend Special',
      lunch: '12:00 PM – 04:30 PM',
      dinner: '06:30 PM – 12:00 Midnight',
      highlight: 'Live Acoustic Music & Midnight Chef Specials',
      status: 'Late Night Dining',
      accent: 'border-amber-500/30 hover:border-amber-500/60'
    },
    {
      days: 'Sunday Royal Feast',
      tag: 'Grand Brunch & Dinner',
      lunch: '11:30 AM – 04:30 PM',
      dinner: '06:00 PM – 11:30 PM',
      highlight: 'Signature Sunday Buffet & Live Barbecue Counter',
      status: 'Family Feast',
      accent: 'border-stone-800 hover:border-emerald-500/40'
    },
  ];

  const highlights = [
    {
      icon: Clock,
      title: 'Real-time Kitchen Orders',
      desc: 'Hot food prepared fresh within 15-25 minutes of ordering.',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      icon: ShieldCheck,
      title: '5-Star Hygiene Certified',
      desc: '100% contactless preparation & Grade-A organic ingredients.',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      icon: Award,
      title: 'Complimentary Valet',
      desc: 'Free valet parking available at our main culinary porch.',
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    },
    {
      icon: UtensilsCrossed,
      title: 'Live Barbecue & Grill',
      desc: 'Outdoor tandoor & sizzling grill active every evening.',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      if (onSuccessToast) onSuccessToast('Please enter your full name and contact phone number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newReservation: TableReservation = {
        id: `TBL-${Math.floor(100000 + Math.random() * 900000)}`,
        fullName,
        phone,
        email,
        guestsCount,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        seatingArea,
        occasion,
        specialRequests,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      setConfirmedReservation(newReservation);
      setIsSubmitting(false);
      if (onSuccessToast) {
        onSuccessToast(`🎉 Dine-in table reserved for ${fullName} on ${selectedDate} at ${selectedTimeSlot}!`);
      }
    }, 600);
  };

  const handleReset = () => {
    setConfirmedReservation(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setSpecialRequests('');
  };

  return (
    <section id="table-booking-timings-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Outer Black Container Wrapper */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-stone-950 via-black to-stone-950 text-white p-6 sm:p-10 lg:p-12 border border-stone-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
        
        {/* Luxury Background Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mt-20" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none -mb-20" />
        <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-bold text-xs uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Luxury Dine-In & Reservations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-serif tracking-tight">
            Book Dine-In Table & Operating Hours
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
            Reserve your table in advance for an exquisite fine dining experience, or check our daily operational kitchen schedule.
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Dine-In Table Booking Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-stone-900/90 border border-stone-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative">
              
              {confirmedReservation ? (
                /* Success Confirmation Card */
                <div className="py-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-400">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold tracking-wide uppercase">
                      Table Reserved Successfully
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                      We're Ready to Host You!
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto">
                      Your dine-in table is confirmed under <strong className="text-amber-300">{confirmedReservation.fullName}</strong>. An instant SMS confirmation has been dispatched.
                    </p>
                  </div>

                  {/* Reservation Summary Box */}
                  <div className="bg-stone-950/80 rounded-2xl p-5 border border-stone-800 text-left max-w-lg mx-auto space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                      <span className="text-xs text-stone-400">Booking Reference</span>
                      <span className="font-mono font-bold text-sm text-amber-400">{confirmedReservation.id}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 text-xs">
                      <div>
                        <span className="text-stone-500 block font-medium">DATE</span>
                        <span className="font-bold text-white text-sm">{confirmedReservation.date}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block font-medium">TIME SLOT</span>
                        <span className="font-bold text-amber-300 text-sm">{confirmedReservation.timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block font-medium">PARTY SIZE</span>
                        <span className="font-bold text-stone-200">{confirmedReservation.guestsCount} Guests</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block font-medium">SEATING AREA</span>
                        <span className="font-bold text-stone-200 capitalize">{confirmedReservation.seatingArea}</span>
                      </div>
                    </div>

                    {confirmedReservation.occasion && (
                      <div className="pt-2 border-t border-stone-800 text-xs">
                        <span className="text-stone-500 font-medium">OCCASION: </span>
                        <span className="font-semibold text-stone-300">{confirmedReservation.occasion}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleReset}
                      className="bg-amber-500 hover:bg-amber-400 text-black text-xs sm:text-sm font-black px-6 py-3 rounded-2xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      Reserve Another Table
                    </button>
                    <a
                      href="#hero-visual-slider"
                      className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl border border-stone-700 transition-colors"
                    >
                      Explore Food Menu
                    </a>
                  </div>
                </div>
              ) : (
                /* Interactive Black-Themed Reservation Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                    <div>
                      <h3 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                        <span>Book a Dine-In Table</span>
                        <Sparkle className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </h3>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Instant table allotment • Zero advance fees
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                      <Utensils className="w-5 h-5" />
                    </div>
                  </div>

                  {/* 1. Guest Count Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>Number of Guests:</span>
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {[1, 2, 3, 4, 6, 8, 12].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuestsCount(num)}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            guestsCount === num
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black border-amber-400 shadow-md shadow-amber-500/30 scale-[1.03] font-black'
                              : 'bg-stone-950/80 hover:bg-stone-800 text-stone-300 border-stone-800'
                          }`}
                        >
                          {num} {num === 1 ? 'Person' : 'Guests'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Date and Dining Occasion */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>Reservation Date:</span>
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-stone-950/90 border border-stone-700/80 rounded-xl p-3 text-xs sm:text-sm font-medium text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 scheme-dark"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dining Occasion:</span>
                      </label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full bg-stone-950/90 border border-stone-700/80 rounded-xl p-3 text-xs sm:text-sm font-medium text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 cursor-pointer"
                      >
                        <option value="Casual Dining" className="bg-stone-900 text-white">Casual Dining & Food</option>
                        <option value="Birthday Celebration" className="bg-stone-900 text-white">🎂 Birthday Celebration</option>
                        <option value="Anniversary Date" className="bg-stone-900 text-white">❤️ Romantic Anniversary</option>
                        <option value="Business Dinner" className="bg-stone-900 text-white">💼 Corporate / Business Dinner</option>
                        <option value="Family Gathering" className="bg-stone-900 text-white">👨‍👩‍👧‍👦 Family Get-together</option>
                      </select>
                    </div>
                  </div>

                  {/* 3. Time Slots */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-stone-300 flex items-center justify-between uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Select Time Slot:</span>
                      </span>
                      <span className="text-[11px] text-amber-400 font-semibold lowercase">
                        Selected: {selectedTimeSlot}
                      </span>
                    </label>

                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Lunch Slots</div>
                      <div className="flex flex-wrap gap-2">
                        {lunchSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                              selectedTimeSlot === slot
                                ? 'bg-white text-black border-white font-bold shadow-xs'
                                : 'bg-stone-950/80 hover:bg-stone-800 text-stone-300 border-stone-800'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>

                      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider pt-1">Dinner & Evening Slots</div>
                      <div className="flex flex-wrap gap-2">
                        {dinnerSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                              selectedTimeSlot === slot
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black border-amber-400 shadow-md shadow-amber-500/25'
                                : 'bg-stone-950/80 hover:bg-stone-800 text-stone-300 border-stone-800'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4. Seating Preference Cards */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Seating Ambience:</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {seatingOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = seatingArea === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSeatingArea(opt.id as any)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-400/80 ring-1 ring-amber-400/40 shadow-xs'
                                : 'bg-stone-950/80 hover:bg-stone-850 border-stone-800'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-amber-500 text-black' : 'bg-stone-800 text-stone-400'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-stone-200'}`}>
                                  {opt.title}
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-stone-800 text-amber-400 uppercase">
                                  {opt.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-400 leading-tight mt-0.5 line-clamp-1">
                                {opt.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alexander Vance"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-stone-950/90 border border-stone-700/80 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +1 (555) 234-5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-stone-950/90 border border-stone-700/80 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
                      />
                    </div>
                  </div>

                  {/* Submit Action */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm sm:text-base py-3.5 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Reserving Table...</span>
                    ) : (
                      <>
                        <span>Confirm Dine-In Reservation</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Timings & Operating Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Restaurant Operating Hours Card */}
            <div className="relative overflow-hidden rounded-3xl bg-stone-900/90 border border-stone-800 shadow-2xl p-6 sm:p-7 space-y-5">
              
              <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white">Kitchen & Dining Hours</h3>
                    <p className="text-[11px] text-stone-400">Serving Hot & Fresh Food Daily</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Open Now</span>
                </div>
              </div>

              {/* Timings List */}
              <div className="relative z-10 space-y-3 text-xs sm:text-sm">
                {scheduleDays.map((item, idx) => (
                  <div key={idx} className={`p-3.5 rounded-2xl bg-stone-950/90 border ${item.accent} transition-all space-y-1.5`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{item.days}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        {item.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-stone-300 text-xs pt-1 border-t border-stone-850">
                      <div>
                        <span className="text-stone-500 block text-[10px] font-semibold">LUNCH</span>
                        <span className="font-medium text-stone-200">{item.lunch}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px] font-semibold">DINNER</span>
                        <span className="font-bold text-amber-300">{item.dinner}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Phone / Contact Inquiry */}
              <div className="relative z-10 pt-2 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-stone-400 block">Instant Helpline (India):</span>
                  <span className="font-bold text-amber-400 font-mono text-sm">+91 1800 456 7890</span>
                </div>
                <a
                  href="https://wa.me/919810123456?text=Hello%20ZestBite,%20I%20would%20like%20to%20inquire%20about%20a%20table%20reservation."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-md shadow-emerald-900/30 w-fit"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Booking</span>
                </a>
              </div>
            </div>

            {/* Location & Valet Card */}
            <div className="rounded-3xl bg-stone-900/80 border border-stone-800 p-5 flex items-start gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <h4 className="font-bold text-white text-sm">Complimentary Valet Parking</h4>
                <p className="text-stone-400 leading-relaxed">
                  Block M, Inner Circle, Connaught Place, New Delhi. Complimentary valet parking service available at our flagship porch for all guests.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features / Highlights (Dark Black Theme) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-stone-800/80">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <div key={i} className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 shadow-md flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${h.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-white">{h.title}</h5>
                  <p className="text-[11px] text-stone-400 leading-snug">{h.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
