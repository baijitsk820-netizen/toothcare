import { Sparkles, Heart, Award, Shield } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-white px-6 border-b border-slate-100">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs bg-[#EAF8FB] border border-[#0097A7]/10 text-[#0097A7] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">About ToothCare Clinic</span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-[#0F172A] tracking-tight">
            Ethical Treatment, Modern Technology, Compassionate Care
          </h2>
          <p className="text-[#556B72] text-sm md:text-base leading-relaxed">
            ToothCare Dental Clinic has become one of the most trusted dental practices in Howrah by consistently maintaining the highest standards of hygiene and sterilization.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Story block */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-8 lg:p-10 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5"></div>
            
            <div className="space-y-6 max-w-xl">
              <span className="text-[10px] bg-[#0097A7]/20 text-[#26C6DA] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#0097A7]/10 inline-block">OUR CLINICAL HERITAGE</span>
              
              <h3 className="text-2xl lg:text-3xl font-bold tracking-tight">
                Our medical professionals focus entirely on preventive, cosmetic, and restorative dentistry.
              </h3>
              
              <p className="text-slate-300 text-sm leading-relaxed font-sans">
                By maintaining a zero-compromise sterilization system and using digital low-radiation diagnostics, we ensure that every diagnosis is highly precise and completely safe. Whether it is a routine scale-and-polish or a full-mouth surgical dental implant, we treat you with care and respect.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-slate-700/50 pt-8 text-left">
              <div>
                <span className="block text-3xl font-extrabold text-[#26C6DA]">1000+</span>
                <span className="block text-xs text-slate-400 mt-1">Successful Procedures</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-[#26C6DA]">100%</span>
                <span className="block text-xs text-slate-400 mt-1">Sterilized & Sterile Clinic</span>
              </div>
            </div>
          </div>

          {/* Mission & Vision sidebar blocks */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Mission block */}
            <div className="bg-gradient-to-br from-[#EAF8FB]/50 to-white border border-[#EAF8FB] p-8 rounded-3xl shadow-sm flex gap-5 items-start">
              <div className="w-12 h-12 bg-[#EAF8FB] text-[#0097A7] rounded-2xl flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 fill-[#0097A7] text-[#0097A7]" />
              </div>
              <div className="space-y-2 text-left">
                <h4 className="font-extrabold text-[#0F172A] text-lg">Our Clinic Mission</h4>
                <p className="text-[#556B72] text-sm leading-relaxed">
                  <strong>Healthy Smiles for Every Family.</strong> Delivering painless, world-class dental solutions to patients of all ages, prioritizing preventive habits and affordable access.
                </p>
              </div>
            </div>

            {/* Vision block */}
            <div className="bg-gradient-to-br from-[#EAF8FB]/30 to-white border border-[#EAF8FB] p-8 rounded-3xl shadow-sm flex gap-5 items-start">
              <div className="w-12 h-12 bg-[#EAF8FB] text-[#0097A7] rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-[#0097A7]" />
              </div>
              <div className="space-y-2 text-left">
                <h4 className="font-extrabold text-[#0F172A] text-lg">Our Clinic Vision</h4>
                <p className="text-[#556B72] text-sm leading-relaxed">
                  <strong>Become the most trusted dental clinic in West Bengal.</strong> We aim to lead the sector by pioneering ethical medicine, transparent pricing structure, and laser-assisted pain-free treatments.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
