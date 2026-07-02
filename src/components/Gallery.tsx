export default function Gallery() {
  const images = [
    {
      title: "Clinic Reception & Lounge",
      emoji: "🛋️",
      size: "col-span-1 md:col-span-2",
      desc: "An elegant, comfortable workspace designed to keep patients calm, sterilized, and completely at ease before checkups."
    },
    {
      title: "Advanced Dental Suite",
      emoji: "💺",
      size: "col-span-1",
      desc: "Our ergonomic dental chair suite configured with digital diagnosis sensors and high-illumination surgical lights."
    },
    {
      title: "Sterilization Operations Lab",
      emoji: "🧼",
      size: "col-span-1",
      desc: "The clinical autoclave autoclaves tools using high-temperature computerized vacuum programs for absolute safety."
    },
    {
      title: "Digital Low-Radiation Sensor RVG",
      emoji: "🖥️",
      size: "col-span-1 md:col-span-2",
      desc: "Instant high-definition mapping radiograph displaying root canals, fractures, and decay points safely in seconds."
    }
  ];

  return (
    <section className="py-20 bg-white px-6 border-b border-[#EAF8FB]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs bg-[#EAF8FB] border border-[#0097A7]/10 text-[#0097A7] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Clinical Workspace</span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-[#0F172A] tracking-tight">
            Our Premium Sterile Facilities
          </h2>
          <p className="text-[#556B72] text-sm">
            Take a visual tour inside ToothCare Dental Clinic. We maintain strict hygiene discipline and use modern diagnostics to make procedures painless.
          </p>
        </div>

        {/* Bento grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {images.map((img, idx) => (
            <div 
              key={idx}
              className={`${img.size} bg-gradient-to-br from-[#EAF8FB]/30 to-white border border-[#EAF8FB] p-8 rounded-3xl text-left flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 relative group`}
            >
              <span className="text-5xl my-4 select-none block group-hover:scale-110 transition-transform">{img.emoji}</span>
              <div>
                <h4 className="font-extrabold text-[#0F172A] text-base">{img.title}</h4>
                <p className="text-[#556B72] text-xs mt-2 leading-relaxed">
                  {img.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
