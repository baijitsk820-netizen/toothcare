import { useState } from "react";
import { Phone, Calendar, ShieldCheck, Clock, Menu, X } from "lucide-react";

interface HeaderProps {
  onBookClick: () => void;
  onAdminClick: () => void;
  isDashboardOpen: boolean;
}

export default function Header({ onBookClick, onAdminClick, isDashboardOpen }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "About Us", href: "#about" },
    { name: "Why Us", href: "#why-choose-us" },
    { name: "Our Doctors", href: "#doctors" },
    { name: "How We Treat", href: "#process" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-[#EAF8FB] shadow-sm transition-all duration-300">
      
      {/* Top Banner with Opening Hours & Phone */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#0097A7] text-white text-xs py-2 px-6 flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-[#0097A7]/20">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#26C6DA] shrink-0" />
          <span className="font-medium">Everyday: <strong className="text-[#EAF8FB]">5:30 PM - 9:30 PM</strong></span>
          <span className="hidden md:inline text-[#26C6DA] px-1.5 py-0.5 bg-[#0097A7]/40 rounded-full font-bold uppercase tracking-wider text-[9px] animate-pulse">Open Daily</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:08444948408" className="hover:text-[#26C6DA] transition-colors flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-[#26C6DA]" />
            <span>Hotline: <strong>08444948408</strong></span>
          </a>
          <span className="text-[#26C6DA]">|</span>
          <span className="text-slate-200">⭐ 4.7 Rated Practice (304+ Reviews)</span>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Branding Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0097A7] to-[#26C6DA] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#0097A7]/20 group-hover:scale-105 transition-all">
            🦷
          </div>
          <div>
            <span className="text-lg font-black text-[#0F172A] tracking-tight block">ToothCare<span className="text-[#0097A7]">Dental</span></span>
            <span className="text-[10px] text-[#0097A7] font-bold uppercase tracking-wider block -mt-1 font-mono">CLINIC</span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-[#556B72] hover:text-[#0097A7] text-sm font-semibold transition-colors duration-200 relative group py-2"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0097A7] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* CTA Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button 
            id="nav-admin-btn"
            onClick={onAdminClick}
            className="px-4 py-2 text-[#556B72] hover:text-[#0097A7] font-bold text-xs transition-colors flex items-center gap-1.5"
            title="Access clinic dashboard"
          >
            <ShieldCheck className="w-4 h-4 text-[#0097A7]" />
            <span>Admin Hub</span>
          </button>
          
          <button 
            id="nav-book-btn"
            onClick={onBookClick}
            className="px-6 py-2.5 bg-[#0097A7] text-white font-bold rounded-full text-xs transition-all shadow-lg shadow-[#0097A7]/20 hover:bg-[#00BCD4] hover:scale-102 active:scale-98"
          >
            <span>Schedule Appointment</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button 
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="lg:hidden p-2 text-[#556B72] hover:text-[#0097A7] hover:bg-[#EAF8FB]/50 rounded-xl"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#EAF8FB] p-6 space-y-4 shadow-xl absolute top-28 left-0 right-0 z-40 animate-fade-in">
          <nav className="flex flex-col gap-3.5">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#0F172A] hover:text-[#0097A7] text-sm font-bold block"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="border-t border-[#EAF8FB] pt-4 flex flex-col gap-3">
            <button 
              id="mobile-nav-admin-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onAdminClick();
              }}
              className="py-3 text-[#556B72] hover:text-[#0097A7] font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-[#EAF8FB] rounded-xl"
            >
              <ShieldCheck className="w-4.5 h-4.5 text-[#0097A7]" />
              <span>Admin Hub Workspace</span>
            </button>
            
            <button 
              id="mobile-nav-book-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onBookClick();
              }}
              className="py-3.5 bg-[#0097A7] text-white font-bold rounded-xl text-sm transition-all text-center flex items-center justify-center gap-2 hover:bg-[#00BCD4]"
            >
              <Calendar className="w-4.5 h-4.5" />
              <span>Schedule Appointment</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
