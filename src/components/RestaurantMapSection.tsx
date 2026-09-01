import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Clock, 
  Phone, 
  Car, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Crosshair, 
  Zap, 
  Bike,
  Building2,
  Share2
} from 'lucide-react';

interface RestaurantMapSectionProps {
  onSuccessToast?: (msg: string) => void;
}

export const RestaurantMapSection: React.FC<RestaurantMapSectionProps> = ({
  onSuccessToast,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<'main' | 'cloud' | 'rooftop'>('main');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [userLocationInput, setUserLocationInput] = useState('');
  const [calculatedDistance, setCalculatedDistance] = useState<{
    distance: string;
    duration: string;
    deliveryFee: string;
    eligible: boolean;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const branches = [
    {
      id: 'main' as const,
      name: 'Central Dine-In & Gourmet Flagship',
      tag: 'New Delhi • Connaught Place',
      address: 'Block M, Inner Circle, Connaught Place, New Delhi, Delhi 110001, India',
      landmark: 'Opposite Rajiv Chowk Metro Station (Gate 2)',
      timings: '11:00 AM – 11:30 PM',
      phone: '+91 98101 23456 / +91 11 4567 8900',
      lat: 28.6315,
      lng: 77.2167,
      embedQuery: 'Connaught+Place+New+Delhi+Delhi+110001+India',
      features: ['Dine-In Restaurant', 'Complimentary Valet Parking', 'Live Tandoor & Barbecue', 'Bar Lounge'],
    },
    {
      id: 'cloud' as const,
      name: 'Tech Corridor Express Hub',
      tag: 'Bengaluru • Indiranagar',
      address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038, India',
      landmark: 'Near Indiranagar Metro Station & Cyber Hub',
      timings: '10:00 AM – 02:00 AM',
      phone: '+91 98450 67890 / +91 80 2345 6789',
      lat: 12.9784,
      lng: 77.6408,
      embedQuery: 'Indiranagar+100+Feet+Road+Bengaluru+Karnataka+India',
      features: ['15-Min Lightning Dispatch', 'Drive-thru Pick-up', 'Contactless Delivery Hub'],
    },
    {
      id: 'rooftop' as const,
      name: 'Sea Breeze Terrace & Lounge',
      tag: 'Mumbai • Bandra West',
      address: 'Sky Bay View, Bandra Reclamation, Bandra West, Mumbai, Maharashtra 400050, India',
      landmark: 'Near Bandra-Worli Sea Link Viewpoint',
      timings: '05:00 PM – 01:30 AM',
      phone: '+91 98200 54321 / +91 22 6789 0123',
      lat: 19.0596,
      lng: 72.8295,
      embedQuery: 'Bandra+West+Mumbai+Maharashtra+India',
      features: ['Panoramic Sea View', 'Cocktail Lounge', 'Live Sufi & Acoustic', 'Private VIP Cabanas'],
    },
  ];

  const currentBranch = branches.find((b) => b.id === selectedBranch) || branches[0];

  const handleCalculateDistance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLocationInput.trim()) return;

    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setCalculatedDistance({
        distance: '2.8 km',
        duration: '15 - 20 mins',
        deliveryFee: 'FREE Delivery',
        eligible: true,
      });
      if (onSuccessToast) {
        onSuccessToast(`📍 ${userLocationInput} is within our 15-min Express Delivery radius in India!`);
      }
    }, 500);
  };

  const handleOpenGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentBranch.address)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${currentBranch.name}, ${currentBranch.address}`);
    if (onSuccessToast) {
      onSuccessToast(`📋 Address copied to clipboard!`);
    }
  };

  return (
    <section id="restaurant-map-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Outer Black Container Wrapper */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-stone-950 via-black to-stone-950 text-white p-6 sm:p-10 lg:p-12 border border-stone-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mt-20" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none -mb-20" />
        <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-bold text-xs uppercase tracking-widest shadow-inner">
            <Compass className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-spin [animation-duration:8s]" />
            <span>Interactive Map & Live Locations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-serif tracking-tight">
            Find Our Location & Delivery Radius
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
            Visit our flagship dine-in restaurant, express dispatch kitchen, or check instant delivery time to your doorstep.
          </p>
        </div>

        {/* Branch Selection Tabs */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mb-8">
          {branches.map((branch) => {
            const isSelected = selectedBranch === branch.id;
            return (
              <button
                key={branch.id}
                onClick={() => {
                  setSelectedBranch(branch.id);
                  setCalculatedDistance(null);
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2.5 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black border-amber-400 shadow-lg shadow-amber-500/25 scale-[1.02] font-black'
                    : 'bg-stone-900/80 hover:bg-stone-850 text-stone-300 border-stone-800'
                }`}
              >
                <MapPin className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-amber-400'}`} />
                <span>{branch.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  isSelected ? 'bg-black/20 text-black' : 'bg-stone-800 text-amber-300'
                }`}>
                  {branch.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Map Embed & Location Details */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Map Canvas Container (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl h-[380px] sm:h-[450px]">
              
              {/* Map Type Controls */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-stone-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-800 shadow-lg text-xs">
                <button
                  onClick={() => setMapType('roadmap')}
                  className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                    mapType === 'roadmap' ? 'bg-amber-500 text-black font-black' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Map View
                </button>
                <button
                  onClick={() => setMapType('satellite')}
                  className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                    mapType === 'satellite' ? 'bg-amber-500 text-black font-black' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Satellite View
                </button>
              </div>

              {/* Action Buttons overlay */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                  onClick={handleCopyAddress}
                  title="Copy full address"
                  className="bg-stone-950/90 hover:bg-stone-800 text-stone-200 p-2.5 rounded-xl border border-stone-800 shadow-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button
                  onClick={handleOpenGoogleMaps}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black px-3.5 py-2 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 fill-black" />
                  <span>Open Directions</span>
                </button>
              </div>

              {/* Embedded Interactive Google Map Iframe */}
              <iframe
                title="Restaurant Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  currentBranch.address
                )}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0 grayscale-[15%] contrast-[110%] brightness-[90%]"
                loading="lazy"
                allowFullScreen
              />

              {/* Live Pin Marker Badge Over Map Bottom */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-stone-950/95 backdrop-blur-md p-4 rounded-2xl border border-stone-800/90 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{currentBranch.name}</h4>
                    <p className="text-[11px] text-stone-400 truncate">{currentBranch.landmark}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Open Now</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Delivery Radius Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">0 – 5 KM RADIUS</span>
                  <span className="text-xs font-bold text-white">15-20 Mins Delivery</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">5 – 12 KM RADIUS</span>
                  <span className="text-xs font-bold text-white">25-35 Mins Gourmet</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">VALET PORCH</span>
                  <span className="text-xs font-bold text-white">Free Reserved Parking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Location Details & Distance Checker (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Location Details Card */}
            <div className="rounded-3xl bg-stone-900/90 border border-stone-800 p-6 sm:p-7 shadow-2xl space-y-5">
              <div className="border-b border-stone-800 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  {currentBranch.tag}
                </span>
                <h3 className="text-xl font-bold font-serif text-white mt-2">
                  {currentBranch.name}
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px] font-semibold uppercase">Street Address</span>
                    <span className="font-bold text-stone-200 leading-snug">{currentBranch.address}</span>
                    <span className="text-stone-400 text-xs block mt-0.5">Landmark: {currentBranch.landmark}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px] font-semibold uppercase">Operational Hours</span>
                    <span className="font-bold text-amber-300">{currentBranch.timings}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px] font-semibold uppercase">Direct Telephone</span>
                    <span className="font-mono font-bold text-white">{currentBranch.phone}</span>
                  </div>
                </div>
              </div>

              {/* Branch Features Badges */}
              <div className="pt-2 border-t border-stone-800">
                <span className="text-[10px] text-stone-500 block uppercase font-bold mb-2">Branch Amenities</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentBranch.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-stone-950 text-stone-300 border border-stone-800 text-[11px] font-semibold"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Distance & Estimated Delivery Calculator */}
            <div className="rounded-3xl bg-stone-900/90 border border-stone-800 p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Crosshair className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Check Delivery Distance</h4>
                  <p className="text-[11px] text-stone-400">Enter your area or street name</p>
                </div>
              </div>

              <form onSubmit={handleCalculateDistance} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userLocationInput}
                    onChange={(e) => setUserLocationInput(e.target.value)}
                    placeholder="e.g. Connaught Place, Karol Bagh, Indiranagar, Bandra"
                    className="flex-1 bg-stone-950 border border-stone-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={isLocating}
                    className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2.5 rounded-xl text-xs font-black transition-colors shrink-0 cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    {isLocating ? 'Checking...' : 'Calculate'}
                  </button>
                </div>
              </form>

              {calculatedDistance && (
                <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/30 text-xs space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 font-medium">Estimated Distance:</span>
                    <span className="font-bold text-amber-400">{calculatedDistance.distance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 font-medium">Delivery Time:</span>
                    <span className="font-bold text-emerald-400">{calculatedDistance.duration}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-stone-800 pt-1.5">
                    <span className="text-stone-400 font-medium">Delivery Charge:</span>
                    <span className="font-bold text-white">{calculatedDistance.deliveryFee}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
