import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import About from "./components/About";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import Doctors from "./components/Doctors";
import Timeline from "./components/Timeline";
import Testimonials from "./components/Testimonials";
import Gallery from "./components/Gallery";
import BookingForm from "./components/BookingForm";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PatientMailbox from "./components/PatientMailbox";
import AdminDashboard from "./components/AdminDashboard";
import ReviewPopup from "./components/ReviewPopup";
import { MessageSquare, Phone, ShieldAlert, CheckCircle, ArrowUp } from "lucide-react";

export default function App() {
  const [preselectedTreatment, setPreselectedTreatment] = useState("Teeth Whitening");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Trigger custom toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 6000);
  };

  // Scroll and preselect treatment from services catalog
  const handleSelectService = (treatmentName: string) => {
    setPreselectedTreatment(treatmentName);
    showToast(`Pre-selected: "${treatmentName}". Scroll to scheduler form completed.`);
    const element = document.getElementById("booking-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookNowScroll = () => {
    const element = document.getElementById("booking-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Optional: check for routing queries in URL for feedback routing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("feedback") === "true") {
      setIsReviewOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#0097A7]/10 selection:text-[#0097A7] scroll-smooth relative">
      
      {/* 1. STICKY PREMIUM HEADER */}
      <Header 
        onBookClick={handleBookNowScroll} 
        onAdminClick={() => setIsAdminOpen(true)}
        isDashboardOpen={isAdminOpen}
      />

      {/* 2. BODY SECTIONS */}
      <main>
        {/* Hero Banner */}
        <Hero onBookClick={handleBookNowScroll} />

        {/* Counter Stats Section */}
        <Stats />

        {/* About Clinic Bento Panel */}
        <About />

        {/* Dynamic Services Catalog */}
        <Services onSelectService={handleSelectService} />

        {/* Benefits Grid */}
        <WhyChooseUs />

        {/* Doctor profiles & vacancies */}
        <Doctors onBookClick={handleBookNowScroll} />

        {/* Vertical clinical timeline */}
        <Timeline />

        {/* Patient reviews & rating trigger card */}
        <Testimonials onLeaveReviewClick={() => setIsReviewOpen(true)} />

        {/* Gallery tour bento */}
        <Gallery />

        {/* Interactive booking form */}
        <BookingForm 
          preselectedTreatment={preselectedTreatment}
          onClearPreselection={() => setPreselectedTreatment("Teeth Whitening")}
        />

        {/* Medical FAQ Accordions */}
        <FAQ />

        {/* Contacts directory & Maps coordinates */}
        <Contact />
      </main>

      {/* 3. FOOTER & SUBSCRIPTIONS */}
      <Footer />

      {/* 4. CLINIC ADMIN WORKSPACE MODAL OVERLAY */}
      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} />
      )}

      {/* 5. EXPERIENTIAL RATING AND REVIEW ROUTER OVERLAY */}
      {isReviewOpen && (
        <ReviewPopup onClose={() => setIsReviewOpen(false)} />
      )}

      {/* 6. REAL-TIME VIRTUAL PATIENT MAILBOX */}
      <PatientMailbox />

      {/* 7. FLOATING QUICK HOTLINES (MOBILE FIXED POSITION ACTIONS) */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2.5">
        {/* Direct Call Button */}
        <a 
          id="floating-call-btn"
          href="tel:08444948408"
          className="w-12 h-12 bg-[#0097A7] hover:bg-[#00BCD4] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all border border-[#0097A7]/20"
          title="Direct Dial Hotline"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* Direct WhatsApp Button */}
        <a 
          id="floating-whatsapp-btn"
          href="https://wa.me/918444948408?text=Hello%20ToothCare%2C%20I%20have%20a%20clinical%20question"
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 bg-[#128C7E] hover:bg-[#075e54] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          title="WhatsApp Support Chat"
        >
          <span className="text-xl">💬</span>
        </a>
      </div>

      {/* 8. GENERAL TOAST NOTIFICATIONS SCREEN BANNER */}
      {isToastVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white py-3 px-6 rounded-full shadow-2xl border border-slate-800 flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
          <CheckCircle className="w-4.5 h-4.5 text-[#26C6DA] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
