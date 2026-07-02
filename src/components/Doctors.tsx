import { Mail, Phone, Calendar, Heart, GraduationCap, Award } from "lucide-react";

interface DoctorsProps {
  onBookClick: () => void;
}

export default function Doctors({ onBookClick }: DoctorsProps) {
  return (
    <section id="doctors" className="py-20 bg-[#F8FCFD] px-6 border-b border-[#EAF8FB]">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs bg-[#EAF8FB] border border-[#0097A7]/10 text-[#0097A7] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Meet Our Specialists</span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-[#0F172A] tracking-tight">
            Highly Qualified Dental Surgeons
          </h2>
          <p className="text-[#556B72] text-sm">
            Our expert dentists bring together years of clinical excellence, specialized postgraduate credentials, and a compassionate, gentle attitude towards every patient.
          </p>
        </div>

        {/* Doctor profiles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Doctor 1: Dr. Rajshekhar Chatterjee */}
          <div className="bg-white border border-[#EAF8FB] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden group">
            
            {/* Absolute accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0097A7]/5 rounded-full blur-2xl"></div>

            <div>
              {/* Doctor Avatar / Illustration */}
              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#0097A7] to-[#26C6DA] rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-md shadow-[#0097A7]/20 select-none group-hover:scale-105 transition-transform duration-300">
                  👨‍⚕️
                </div>
                <div>
                  <h3 className="font-extrabold text-[#0F172A] text-xl">Dr. Rajshekhar Chatterjee</h3>
                  <p className="text-[#0097A7] text-xs font-bold font-mono mt-0.5 uppercase tracking-wider">Senior Dental Surgeon</p>
                  <p className="text-slate-400 text-xs mt-1">12+ Years of Clinical Practice</p>
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-[#556B72] text-xs leading-relaxed mb-6 font-sans">
                Dr. Rajshekhar Chatterjee is a leading dental surgeon in Howrah, specializing in complex root canal therapies, laser surgery, and full-mouth implantology. He is dedicated to offering highly ethical, painless, and transparent dental assessments.
              </p>

              {/* Specs & Credentials */}
              <div className="space-y-3.5 border-t border-[#EAF8FB] pt-5">
                <div className="flex items-center gap-2.5 text-xs text-[#556B72]">
                  <GraduationCap className="w-4 h-4 text-[#0097A7] shrink-0" />
                  <span>MDS - Prosthodontics & Implantology</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#556B72]">
                  <Award className="w-4 h-4 text-[#0097A7] shrink-0" />
                  <span>Specialized in Rotary Root Canals & Cosmetic Veneers</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#556B72]">
                  <Heart className="w-4 h-4 text-[#0097A7] shrink-0" />
                  <span>Registered with Dental Council of India (DCI)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-[#EAF8FB] flex gap-3">
              <button 
                id="doc-chat-btn"
                onClick={onBookClick}
                className="flex-1 py-3 bg-[#0097A7] hover:bg-[#00BCD4] text-white font-bold rounded-full text-xs transition-colors text-center shadow-md shadow-[#0097A7]/10"
              >
                Schedule Consultation
              </button>
              <a 
                href="tel:08444948408"
                className="px-4 py-3 border border-[#0097A7]/20 hover:border-[#0097A7] hover:bg-[#EAF8FB] rounded-full flex items-center justify-center transition-all"
                title="Call doctor office"
              >
                <Phone className="w-4 h-4 text-[#0097A7]" />
              </a>
            </div>

          </div>

          {/* Doctor 2 (Future Expansion placeholder as requested) */}
          <div className="bg-gradient-to-br from-[#EAF8FB]/10 to-white border border-dashed border-[#EAF8FB] rounded-3xl p-8 flex flex-col justify-between text-center items-center">
            
            <div className="my-auto space-y-4 py-8">
              <div className="w-16 h-16 bg-[#EAF8FB] rounded-2xl flex items-center justify-center text-[#0097A7] text-3xl mx-auto border border-dashed border-[#0097A7]/30">
                👩‍⚕️
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[#0F172A] text-lg">Orthodontics Specialist</h3>
                <p className="text-[#0097A7] text-xs font-semibold uppercase tracking-wider font-mono">Position Expanding Soon</p>
              </div>
              <p className="text-[#556B72] text-xs max-w-xs mx-auto leading-relaxed">
                We are currently expanding our surgical clinical suites to onboard a resident Pediatric & Orthodontics surgeon for advanced clip therapies.
              </p>
            </div>

            <button 
              id="doc-expand-apply"
              onClick={() => alert("Clinic vacancy application: For details, please submit your CV to career@toothcaredental.com")}
              className="py-2.5 px-5 border border-[#EAF8FB] hover:bg-[#EAF8FB]/50 text-[#556B72] font-bold rounded-full text-xs transition-colors"
            >
              Careers / Vacancies
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
