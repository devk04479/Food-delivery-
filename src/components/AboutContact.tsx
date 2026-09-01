import React, { useState } from 'react';
import { RestaurantMapSection } from './RestaurantMapSection';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Award, 
  Send, 
  CheckCircle2, 
  HelpCircle,
  ChefHat,
  HeartHandshake
} from 'lucide-react';

export const AboutContact: React.FC = () => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How fast will my food arrive?',
      a: 'We prepare all dishes fresh to order. Standard delivery takes 25-30 minutes. If you select Lightning Express at checkout, our dedicated dispatch team prioritizes your order for arrival in 15-20 minutes.',
    },
    {
      q: 'Is there a minimum order amount for free delivery?',
      a: 'Orders above $25 automatically qualify for 100% Free Delivery! You can also apply coupon code FREESHIP on qualifying orders.',
    },
    {
      q: 'Can I customize my food or request spice adjustments?',
      a: 'Absolutely! When clicking any dish on our menu, you can pick specific portion sizes, extra toppings/cheese, customize the spice meter (Mild to Extra Hot), and write custom notes for our kitchen chef.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major payment methods including Instant UPI QR Scan (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, Amex), Apple/Google Wallet, and Cash on Delivery (COD).',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formMessage) return;
    setFormSubmitted(true);
    setFormName('');
    setFormEmail('');
    setFormMessage('');
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-extrabold uppercase tracking-wider">
          <ChefHat className="w-3.5 h-3.5" />
          <span>Our Story & Commitment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-serif tracking-tight">
          Crafting Unforgettable Flavors with Passion & Care
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Founded with a simple culinary promise: to serve artisanal, freshly cooked gourmet meals delivered piping hot to your doorstep in under 30 minutes.
        </p>
      </div>

      {/* Story & Philosophy 3-Column Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">Farm-Fresh Ingredients</h3>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            We partner with local organic growers and certified suppliers to source the freshest herbs, produce, and prime cuts daily. No preservatives or frozen shortcuts.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">100% Sanitized Kitchen</h3>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            Our ISO-grade commercial kitchen undergoes mandatory hourly sanitization, temperature-controlled food sealing, and tamper-proof packaging.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">Dedicated Customer Love</h3>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            Not completely happy with your meal? Our instant support hotline resolves any taste, delivery, or packaging feedback with 100% satisfaction guaranteed.
          </p>
        </div>
      </div>

      {/* Operational Details & Contact Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Contact & Location Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-stone-800">
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif text-amber-300">
                Get In Touch With Our Kitchen
              </h3>
              <p className="text-xs text-stone-400">
                We're always here to assist with catering orders, queries, and feedback.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-amber-300 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Central Gourmet Kitchen Hub</div>
                  <div className="text-stone-300 text-xs mt-0.5 leading-relaxed">
                    Block M, Inner Circle, Connaught Place, New Delhi, Delhi - 110001, India
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-amber-300 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">24/7 Delivery Hotline (India)</div>
                  <div className="text-stone-300 text-xs mt-0.5">+91 1800 555 9378 / +91 98101 23456</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-amber-300 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Support & Catering Email</div>
                  <div className="text-stone-300 text-xs mt-0.5">hello@zestbitefoods.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-amber-300 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Kitchen Serving Hours</div>
                  <div className="text-stone-300 text-xs mt-0.5">Monday – Sunday: 10:00 AM – 11:30 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Feedback Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-xl font-bold text-stone-900 font-serif">
              Send us a Message or Catering Inquiry
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Have a question about large party orders, dietary allergies, or feedback? Drop us a note!
            </p>
          </div>

          {formSubmitted && (
            <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your message has been received. Our team will contact you shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Emily Davis"
                  className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="emily@example.com"
                  className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Your Message or Feedback *</label>
              <textarea
                rows={4}
                required
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                placeholder="How can we assist you with your dining experience?"
                className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* Interactive Location & Delivery Radius Map */}
      <RestaurantMapSection />

      {/* Frequently Asked Questions */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-orange-600" />
          <h3 className="text-xl font-bold text-stone-900 font-serif">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveFaq(isOpen ? null : idx)}
                className="p-4 bg-white rounded-2xl border border-stone-200/80 cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between font-bold text-sm text-stone-900">
                  <span>{faq.q}</span>
                  <span className="text-orange-600 font-mono text-base">{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && (
                  <p className="text-xs text-stone-600 leading-relaxed pt-1 border-t border-stone-100">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
