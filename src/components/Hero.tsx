import { Phone, Calendar, Heart, Award, ShieldAlert, CheckCircle } from "lucide-react";

interface HeroProps {
  onBookClick: () => void;
}

export default function Hero({ onBookClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF8FB] via-white to-sky-50/50 py-16 lg:py-24 px-6 border-b border-[#EAF8FB]">
      
      {/* Absolute Decorative Blobs */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#26C6DA]/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-[#0097A7]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Copy and CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EAF8FB] border border-[#0097A7]/10 rounded-full text-[11px] font-bold text-[#0097A7] uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#0097A7]" />
            <span>Howrah's Most Trusted Family Dental Practice</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-sans text-[#0F172A] leading-tight tracking-tight">
            Premium Dental Care For Your <span className="bg-gradient-to-r from-[#0097A7] to-[#26C6DA] bg-clip-text text-transparent">Beautiful Smile</span>
          </h1>

          <p className="text-[#556B72] text-sm md:text-base leading-relaxed max-w-2xl">
            Providing painless, advanced, and affordable dental treatment in Howrah. We integrate experienced surgeons, sterile diagnostic labs, and modern technology to keep your teeth healthy and life beautiful.
          </p>

          {/* Core Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-2">
            <div className="flex items-center gap-2.5 text-[#556B72]">
              <CheckCircle className="w-5 h-5 text-[#0097A7] shrink-0" />
              <span className="text-xs font-semibold">100% Painless & Laser Assisted Surgery</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#556B72]">
              <CheckCircle className="w-5 h-5 text-[#0097A7] shrink-0" />
              <span className="text-xs font-semibold">Highest Sterilization & Hygiene Standards</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#556B72]">
              <CheckCircle className="w-5 h-5 text-[#0097A7] shrink-0" />
              <span className="text-xs font-semibold">Digital Low-Exposure Dental X-Ray</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#556B72]">
              <CheckCircle className="w-5 h-5 text-[#0097A7] shrink-0" />
              <span className="text-xs font-semibold">Comfortable Pediatric Family Suite</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
            <button 
              id="hero-book-btn"
              onClick={onBookClick}
              className="px-8 py-4 bg-[#0097A7] hover:bg-[#00BCD4] text-white font-bold rounded-full text-sm transition-all shadow-lg shadow-[#0097A7]/20 text-center hover:scale-103 active:scale-97 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4.5 h-4.5" />
              <span>Book Appointment Online</span>
            </button>
            
            <a 
              href="tel:08444948408"
              className="px-8 py-4 border border-[#0097A7]/20 hover:border-[#0097A7] bg-white hover:bg-[#EAF8FB]/30 text-[#0F172A] font-bold rounded-full text-sm transition-all text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <Phone className="w-4.5 h-4.5 text-[#0097A7]" />
              <span>Call: 08444948408</span>
            </a>
          </div>

          {/* Google Ratings & Trust snippet */}
          <div className="flex items-center gap-4 border-t border-[#EAF8FB] pt-6 mt-6">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-amber-400 font-bold text-lg">★</span>
              ))}
              <span className="ml-2 text-sm font-bold text-[#0F172A]">4.7★ Rating</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-[#556B72] font-medium">304+ Verified Google Patients reviews in Howrah</span>
          </div>

        </div>

        {/* Right Side: Visual Glassmorphism Collage */}
        <div className="lg:col-span-5 relative flex justify-center">
          
          {/* Main Dental Graphic Canvas */}
          <div className="w-full max-w-[380px] aspect-square rounded-[3rem] bg-gradient-to-br from-[#0097A7] to-[#26C6DA] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            
            {/* Absolute Abstract Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
            
            <div className="space-y-4">
              <span className="text-[10px] bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block">ToothCare Clinic</span>
              <h3 className="text-2xl font-black tracking-tight leading-snug">Empowering Happy Smiles Every Single Day.</h3>
            </div>

            {/* Glowing Big Tooth vector silhouette mock using characters */}
            <div className="text-8xl text-center my-6 select-none animate-bounce" style={{ animationDuration: '4s' }}>
              🦷
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="block text-[10px] uppercase text-[#EAF8FB] font-bold tracking-wider">OPENS AT</span>
                <span className="block font-bold text-sm">Everyday at 5:30 PM</span>
              </div>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
            </div>

          </div>

          {/* Floating Bubble A: Clinic Chair Stat */}
          <div className="absolute -top-6 -left-6 bg-white border border-[#EAF8FB] p-3 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce" style={{ animationDuration: '5s' }}>
            <div className="w-9 h-9 bg-[#EAF8FB] rounded-xl flex items-center justify-center text-[#0097A7]">
              <Heart className="w-5 h-5 fill-[#0097A7] text-[#0097A7]" />
            </div>
            <div>
              <span className="block text-[9px] text-slate-400 uppercase font-extrabold">PATIENT RECOVERY</span>
              <span className="block font-bold text-xs text-[#0F172A]">100% Pain-free</span>
            </div>
          </div>

          {/* Floating Bubble B: Emergency CTA Flag */}
          <div className="absolute bottom-4 -right-4 bg-rose-50 border border-rose-100 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="block text-[9px] text-rose-500 uppercase font-black">24H DENTAL EMERGENCY</span>
              <a href="tel:08444948408" className="block font-bold text-xs text-rose-950 hover:underline">08444948408</a>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
