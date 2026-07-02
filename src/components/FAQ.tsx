import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do root canals hurt?",
      a: "No! At ToothCare Dental Clinic, we utilize local anesthetics to completely numb the target area. Most of our patients state that having a modern rotary root canal feels no different than getting a standard composite filling."
    },
    {
      q: "How long do dental implants last?",
      a: "With correct oral hygiene and regular clinical checkups, premium titanium dental implants can last a lifetime. The visible zirconia crowns mounted on top generally remain flawless for 15 to 25 years before showing minor wear."
    },
    {
      q: "Do you treat young children?",
      a: "Yes! We specialize in Pediatric Dentistry. Our surgeons have extensive experience in treating children with extreme patience, using positive reinforcement, and explaining procedures in playful, child-friendly terms."
    },
    {
      q: "How often should I visit the dentist?",
      a: "We recommend visiting our clinic for a scaling and diagnostic checkup once every 6 months. This preventive schedule helps catch minor plaque deposits or micro-cavities before they turn into severe painful decay."
    },
    {
      q: "Do you accept emergency dental patients?",
      a: "Absolutely. If you suffer from a broken tooth, severe jaw trauma, or an unbearable toothache, please call our emergency hotline 08444948408 immediately. We accommodate same-day appointments to relieve your discomfort."
    }
  ];

  return (
    <section className="py-20 bg-[#F8FCFD] px-6 border-b border-[#EAF8FB]">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Section title */}
        <div className="text-center space-y-3">
          <span className="text-xs bg-[#EAF8FB] border border-[#0097A7]/10 text-[#0097A7] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Clinical FAQ</span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-[#0F172A] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-[#556B72] text-sm">
            Have questions about clinical safety, recovery periods, or surgical treatments? Find clear answers compiled directly by our senior medical practitioners.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-[#EAF8FB] rounded-2xl shadow-sm overflow-hidden transition-all"
              >
                <button
                  id={`faq-btn-${idx}`}
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left font-bold text-[#0F172A] text-sm hover:bg-[#EAF8FB]/20 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#0097A7] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#0097A7]" /> : <ChevronDown className="w-4 h-4 text-[#26C6DA]" />}
                </button>
                
                {isOpen && (
                  <div className="p-5 border-t border-[#EAF8FB] text-[#556B72] text-xs leading-relaxed bg-[#F8FCFD]/50 animate-fade-in font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
