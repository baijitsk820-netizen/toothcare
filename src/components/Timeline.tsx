import { CalendarCheck, Stethoscope, Search, FileSpreadsheet, Sparkles, Smile } from "lucide-react";

export default function Timeline() {
  const steps = [
    {
      step: "Step 01",
      title: "Book Online Appointment",
      description: "Quickly reserve your convenient slot online or over phone. Receive immediate branded confirmation emails and calendar reminders.",
      icon: CalendarCheck
    },
    {
      step: "Step 02",
      title: "Dental Examination",
      description: "Our surgeons conduct a full checkup of your teeth, gums, jaw, and alignment under high-intensity sterile medical fixtures.",
      icon: Stethoscope
    },
    {
      step: "Step 03",
      title: "Digital low-radiation Diagnosis",
      description: "If required, we map your teeth instantly using ultra-low exposure digital sensors to see hidden roots or decay gaps.",
      icon: Search
    },
    {
      step: "Step 04",
      title: "Transparent Treatment Plan",
      description: "We explain everything clearly, showing you the exact diagnosis and providing a written price breakdown before treatment starts.",
      icon: FileSpreadsheet
    },
    {
      step: "Step 05",
      title: "Painless Dental Treatment",
      description: "Your designated senior surgeon conducts the laser-assisted or anesthetized treatment with world-class sterile care.",
      icon: Sparkles
    },
    {
      step: "Step 06",
      title: "Brighter, Healthy Smile",
      description: "Leave our clinic smiling with confidence! We automatically log your status, send recovery tips, and a Google Review request.",
      icon: Smile
    }
  ];

  return (
    <section id="process" className="py-20 bg-white px-6 border-b border-[#EAF8FB]">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs bg-[#EAF8FB] border border-[#0097A7]/10 text-[#0097A7] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Our Clinic Flow</span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-[#0F172A] tracking-tight">
            Our Patient Treatment Process
          </h2>
          <p className="text-[#556B72] text-sm">
            Experience clinical care structured around your absolute comfort. No rushed consults, no hidden fees, and complete painless procedure assurance.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div 
                key={idx}
                className="bg-gradient-to-br from-[#F8FCFD] to-white border border-[#EAF8FB] p-8 rounded-3xl text-left relative overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                {/* Step badge */}
                <span className="text-[#0097A7]/10 font-black text-5xl font-mono absolute top-4 right-4 select-none group-hover:text-[#0097A7]/25 transition-colors">
                  {item.step.split(" ")[1]}
                </span>

                <div className="w-11 h-11 bg-[#EAF8FB] text-[#0097A7] rounded-xl flex items-center justify-center mb-6">
                  <IconComp className="w-5 h-5 text-[#0097A7]" />
                </div>

                <div className="space-y-2">
                  <span className="block text-[10px] text-[#0097A7] font-mono font-bold uppercase tracking-widest">{item.step}</span>
                  <h4 className="font-extrabold text-[#0F172A] text-base">{item.title}</h4>
                  <p className="text-[#556B72] text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
