import { Star, Users, Briefcase, Sparkles } from "lucide-react";

export default function Stats() {
  const statistics = [
    {
      num: "304+",
      label: "Google Reviews",
      desc: "5-star average feedback",
      icon: Star
    },
    {
      num: "1000+",
      label: "Happy Patients",
      desc: "Successful clinical sessions",
      icon: Users
    },
    {
      num: "15+",
      label: "Dental Treatments",
      desc: "Comprehensive solutions",
      icon: Briefcase
    },
    {
      num: "10+",
      label: "Years of Experience",
      desc: "Clinical dental surgeon lead",
      icon: Sparkles
    }
  ];

  return (
    <section className="py-12 bg-[#0F172A] text-white px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statistics.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div key={idx} className="text-center p-4 space-y-2 relative group">
                <div className="w-10 h-10 bg-[#0097A7]/15 text-[#26C6DA] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <IconComp className="w-5 h-5 text-[#26C6DA]" />
                </div>
                <span className="block text-3xl md:text-4xl font-black text-white font-sans tracking-tight">
                  {stat.num}
                </span>
                <span className="block font-bold text-xs text-[#26C6DA]">
                  {stat.label}
                </span>
                <span className="block text-[10px] text-slate-300">
                  {stat.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
