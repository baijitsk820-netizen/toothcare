import { useState } from "react";
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Activity, 
  Layers, 
  ShieldCheck, 
  HeartHandshake, 
  Flame, 
  UserCheck, 
  Zap, 
  Heart 
} from "lucide-react";

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
}

export default function Services({ onSelectService }: ServicesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "cosmetic" | "surgical" | "restorative" | "preventive">("all");

  const services = [
    {
      name: "Root Canal Treatment",
      category: "restorative",
      description: "Advanced painless root canal procedures using rotary endodontics and computerized mapping for comfortable tooth preservation.",
      icon: Activity,
      highlight: "Highly Requested"
    },
    {
      name: "Dental Implants",
      category: "surgical",
      description: "Lifelike single/multiple tooth replacement solutions utilizing medical-grade titanium posts and zirconia crowns for full jaw restoration.",
      icon: Layers,
      highlight: "Premium Procedure"
    },
    {
      name: "Teeth Whitening",
      category: "cosmetic",
      description: "Safe, rapid-acting laser teeth whitening sessions that lighten your teeth up to 8 shades in a single comfortable 45-minute visit.",
      icon: Sparkles,
      highlight: "Laser Assisted"
    },
    {
      name: "Cosmetic Dentistry",
      category: "cosmetic",
      description: "Customized smile makeovers involving ultra-thin ceramic veneers, dental bonding, and teeth reshaping for a perfectly aligned smile.",
      icon: Zap,
      highlight: "Smile Design"
    },
    {
      name: "Digital Dental X-Ray",
      category: "preventive",
      description: "Ultra-low radiation digital radiograph imaging delivering instantaneous high-definition structures for precise diagnostic mapping.",
      icon: ShieldCheck,
      highlight: "Zero Radiation"
    },
    {
      name: "Pediatric Dentistry",
      category: "preventive",
      description: "Compassionate, friendly child dental suites specialized in gentle cleanings, dental sealants, and cavity defense with playful care.",
      icon: UserCheck,
      highlight: "Kid Friendly"
    },
    {
      name: "Tooth Extraction",
      category: "surgical",
      description: "Aesthetic, sterile, fully local-anesthetized tooth extractions including complex wisdom tooth impactions with zero stress.",
      icon: Flame,
      highlight: "Painless Solution"
    },
    {
      name: "Laser Dentistry",
      category: "cosmetic",
      description: "Soft tissue therapies, rapid wound healing, and bloodless gum contouring using advanced dual-wave surgical dental lasers.",
      icon: HeartHandshake,
      highlight: "Advanced Tech"
    }
  ];

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="services" className="py-20 bg-[#F8FCFD] px-6 border-b border-[#EAF8FB]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header summary */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="text-left max-w-2xl space-y-3">
            <span className="text-xs bg-[#EAF8FB] border border-[#0097A7]/10 text-[#0097A7] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Premium Dental Services</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-[#0F172A] tracking-tight">
              State-of-the-Art Dental Solutions in Howrah
            </h2>
            <p className="text-[#556B72] text-sm">
              Explore our full directory of certified procedures. We prioritize non-invasive treatments, strict sterile preparation, and aesthetic visual quality.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-80 shrink-0">
            <span className="absolute left-3 top-3.5 text-slate-400"><Search className="w-4 h-4" /></span>
            <input 
              type="text" 
              placeholder="Search treatments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-white border border-[#EAF8FB] rounded-2xl text-slate-800 text-xs focus:ring-2 focus:ring-[#0097A7]/20 outline-none shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#EAF8FB] pb-4">
          {[
            { id: "all", label: "All Treatments" },
            { id: "cosmetic", label: "Cosmetic & Veneers" },
            { id: "restorative", label: "Root Canal & Crowns" },
            { id: "surgical", label: "Implants & Extractions" },
            { id: "preventive", label: "Preventive & Diagnostics" },
          ].map((cat) => (
            <button
              id={`service-cat-${cat.id}`}
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat.id 
                  ? "bg-[#0097A7] text-white shadow-md shadow-[#0097A7]/15" 
                  : "bg-white hover:bg-[#EAF8FB]/50 text-[#556B72] border border-[#EAF8FB]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white border border-[#EAF8FB] rounded-3xl text-slate-400">
              <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold">No matching dental services found</p>
              <p className="text-xs">Adjust your search keyword or try selecting "All Treatments".</p>
            </div>
          ) : (
            filteredServices.map((service, index) => {
              const IconComp = service.icon;
              return (
                <div 
                  key={service.name}
                  className="bg-white border border-[#EAF8FB] p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-left relative overflow-hidden"
                >
                  
                  {/* Highlight flag */}
                  <span className="absolute top-4 right-4 bg-[#EAF8FB] text-[#0097A7] font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#0097A7]/10">
                    {service.highlight}
                  </span>

                  <div>
                    {/* Icon container */}
                    <div className="w-12 h-12 bg-gradient-to-tr from-[#EAF8FB] to-[#EAF8FB]/20 text-[#0097A7] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <IconComp className="w-6 h-6 text-[#0097A7]" />
                    </div>

                    <h3 className="font-extrabold text-[#0F172A] text-lg mt-6 group-hover:text-[#0097A7] transition-colors">
                      {service.name}
                    </h3>

                    <p className="text-[#556B72] text-xs mt-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Actions footer inside card */}
                  <div className="mt-8 pt-4 border-t border-[#EAF8FB] flex items-center justify-between">
                    <button 
                      id={`book-service-${index}`}
                      onClick={() => onSelectService(service.name)}
                      className="text-[#0097A7] hover:text-[#00BCD4] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
                    >
                      <span>Schedule Visit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest font-mono">Painless</span>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
