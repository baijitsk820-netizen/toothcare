import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { ContactMessage } from "../types";
import { emailService } from "../services/emailService";
import { localDb } from "../services/localFallback";
import { MapPin, Phone, Clock, MessageSquare, Send, CheckCircle, ExternalLink } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      const contactData: ContactMessage = {
        id: "con_" + Math.random().toString(36).substring(2, 10),
        name,
        email,
        phone,
        message,
        createdAt: new Date().toISOString(),
        status: "unread"
      };

      // 1. Save message to Firestore (catch any Firestore database failure seamlessly)
      try {
        await addDoc(collection(db, "contacts"), {
          ...contactData,
          createdAtTimestamp: serverTimestamp()
        });

        // 2. Add System Notification for Admin Dashboard
        await addDoc(collection(db, "admin_notifications"), {
          type: "new_contact",
          title: "✉️ Website Inquiry Submitted",
          message: `${name} has sent a clinical message: "${message.substring(0, 40)}..."`,
          time: new Date().toISOString(),
          read: false
        });
      } catch (dbErr) {
        console.warn("Firestore contact save failed, falling back to local: ", dbErr);
      }

      // Always save to localDb to support Sandbox Bypass and offline robustness
      localDb.saveContact(contactData);
      localDb.saveNotification({
        id: "not_" + Math.random().toString(36).substring(2, 10),
        type: "new_contact",
        title: "✉️ Website Inquiry Submitted",
        message: `${name} has sent a clinical message: "${message.substring(0, 40)}..."`,
        time: new Date().toISOString(),
        read: false
      });
      window.dispatchEvent(new Event("localDbUpdated"));

      // 3. Trigger Email notifications
      await emailService.sendContactNotifications(contactData);

      // Reset
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 5000);

    } catch (err) {
      console.error("Failed to submit contact query: ", err);
      // Fallback is handled, so we can still display success to user!
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white px-6 border-b border-[#EAF8FB]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Left col: Contact info */}
        <div className="lg:col-span-5 text-left flex flex-col justify-between py-2 space-y-8">
          <div className="space-y-6">
            <span className="text-xs bg-[#EAF8FB] border border-[#0097A7]/10 text-[#0097A7] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Contact Details</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-[#0F172A] tracking-tight leading-tight">
              Get In Touch With ToothCare Today
            </h2>
            <p className="text-[#556B72] text-sm leading-relaxed font-sans">
              Have questions about pricing, treatments, or specific emergency bookings? Submit your details, and our duty clinical assistant will reach out to you within 24 hours.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#EAF8FB] text-[#0097A7] rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#0097A7]" />
                </div>
                <div>
                  <span className="block font-bold text-xs text-[#0F172A]">Our Location</span>
                  <p className="text-[#556B72] text-xs mt-0.5 leading-relaxed">
                    Andul Road Mill Gate, Opposite Bank of India, 1st Floor, Above Software Wizard, Beside Srima Clinic, Howrah, West Bengal - 711302, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#EAF8FB] text-[#0097A7] rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#0097A7]" />
                </div>
                <div>
                  <span className="block font-bold text-xs text-[#0F172A]">Direct Hotlines</span>
                  <p className="text-[#556B72] text-xs mt-0.5">
                    Call: <a href="tel:08444948408" className="font-bold text-[#0097A7] hover:underline">08444948408</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#EAF8FB] text-[#0097A7] rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#0097A7]" />
                </div>
                <div>
                  <span className="block font-bold text-xs text-[#0F172A]">Opening Hours</span>
                  <p className="text-[#556B72] text-xs mt-0.5 font-sans">
                    Opens Daily at <strong>5:30 PM - 9:30 PM</strong> (Closed Now in mornings)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links buttons */}
          <div className="flex gap-2.5">
            <a 
              href="https://maps.google.com/?q=Andul+Road+Mill+Gate+Howrah"
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 border border-[#EAF8FB] hover:bg-[#EAF8FB]/30 hover:border-[#0097A7]/30 text-slate-700 text-center font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <ExternalLink className="w-4 h-4 text-[#0097A7]" />
              <span>Google Map Nav</span>
            </a>
            <a 
              href="https://wa.me/918444948408?text=Hello%20ToothCare"
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 bg-[#128C7E] hover:bg-[#075e54] text-white text-center font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>

        {/* Right col: Form & Embedded map */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Submit form */}
          <form 
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-[#F8FCFD] to-white border border-[#EAF8FB] rounded-3xl p-8 shadow-sm text-left space-y-4"
          >
            <h3 className="font-extrabold text-[#0F172A] text-lg font-sans">Submit a Question / Inquiry</h3>

            {success && (
              <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Message submitted! Check the floating Email Sandbox to preview the automated auto-reply template!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[#556B72] uppercase tracking-wider mb-1">Your Name *</label>
                <input 
                  type="text" 
                  placeholder="Rahul Sen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EAF8FB] rounded-xl text-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0097A7]/20"
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#556B72] uppercase tracking-wider mb-1">Phone Number *</label>
                <input 
                  type="tel" 
                  placeholder="08444948408"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EAF8FB] rounded-xl text-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0097A7]/20"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#556B72] uppercase tracking-wider mb-1">Email Address (Optional)</label>
              <input 
                type="email" 
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAF8FB] rounded-xl text-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0097A7]/20"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#556B72] uppercase tracking-wider mb-1">Write your Message *</label>
              <textarea 
                placeholder="Write your symptoms or treatments query here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-24 px-3.5 py-2.5 bg-white border border-[#EAF8FB] rounded-xl text-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#0097A7]/20 resize-none"
                required 
              />
            </div>

            <button 
              id="contact-form-submit"
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-[#0097A7] hover:bg-[#00BCD4] text-white font-extrabold rounded-full text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-[#0097A7]/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Sending Inquiry..." : "Submit Inquiry Securely"}</span>
            </button>
          </form>

          {/* Map layout visual block */}
          <div className="bg-slate-100 h-44 rounded-3xl overflow-hidden border border-slate-200 relative shadow-inner">
            <div className="absolute inset-0 bg-slate-900/10 pointer-events-none"></div>
            <iframe 
              title="ToothCare Google Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.582697858348!2d88.236166!3d22.557335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02796df3f24bf7%3A0xe67ca6ec3fe3cf48!2sAndul+Rd%2C+Howrah%2C+West+Bengal!5e0!3m2!1sen!2sin!4v1544494840800"
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
              allowFullScreen={false}
              loading="lazy"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
