import { Shield, Sparkles, Award, Heart, CheckCircle, Smile } from "lucide-react";

export default function WhyChooseUs() {
  const benefits = [
    {
      title: "Experienced Surgeons",
      description: "Our core clinical team is led by senior dental surgeon Dr. Rajshekhar Chatterjee with intensive expertise in oral surgery, root canals, and cosmetic implants.",
      icon: Award
    },
    {
      title: "Painless Modern Laser Care",
      description: "We utilize dental anesthesia gels and soft-tissue lasers to ensure that procedures like fillings, root canals, and scaling are comfortable and pain-free.",
      icon: Sparkles
    },
    {
      title: "100% Sterile Preparation",
      description: "Our clinic is fully sterilized according to international medical protocols. Every diagnostic tool is autoclaved in multi-vacuum steam chambers.",
      icon: Shield
    },
    {
      title: "Digital Low-Radiation X-Ray",
      description: "We employ high-speed computerized dental sensors (RVG) which cut down patient radiation exposure by over 90% while providing instant diagnostics.",
      icon: Smile
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-white px-6 border-b border-[#EAF8FB]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left text column */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <span className="text-xs bg-[#EAF8FB] border border-[#0097A7]/10 text-[#0097A7] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-[#0F172A] tracking-tight leading-tight">
            Setting the Benchmark for Private Dentistry in West Bengal
          </h2>
          <p className="text-[#556B72] text-sm leading-relaxed">
            At ToothCare Dental Clinic, we believe dentistry should be ethical, fully transparent, and completely free of anxiety. We have crafted an environment that feels welcoming, clean, and highly sophisticated.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-[#0097A7] shrink-0 mt-0.5" />
              <p className="text-xs text-[#556B72] font-medium">Free Initial Consultation with booked appointments</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-[#0097A7] shrink-0 mt-0.5" />
              <p className="text-xs text-[#556B72] font-medium">Direct WhatsApp Support line with on-call duty nurse</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-[#0097A7] shrink-0 mt-0.5" />
              <p className="text-xs text-[#556B72] font-medium">Clear cost breakdown before beginning any treatment</p>
            </div>
          </div>
        </div>

        {/* Right grid cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((benefit, idx) => {
            const IconComp = benefit.icon;
            return (
              <div 
                key={idx}
                className="bg-gradient-to-br from-[#F8FCFD] to-white border border-[#EAF8FB] p-6 rounded-3xl text-left shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 bg-[#EAF8FB] text-[#0097A7] rounded-xl flex items-center justify-center mb-4">
                  <IconComp className="w-5 h-5 text-[#0097A7]" />
                </div>
                <h4 className="font-extrabold text-[#0F172A] text-base">{benefit.title}</h4>
                <p className="text-[#556B72] text-xs mt-2.5 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
