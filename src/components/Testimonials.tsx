import { Star, MessageSquare, Award, Smile } from "lucide-react";

interface TestimonialsProps {
  onLeaveReviewClick: () => void;
}

export default function Testimonials({ onLeaveReviewClick }: TestimonialsProps) {
  const reviews = [
    {
      name: "Rahul Sen",
      location: "Andul, Howrah",
      text: "The doctors are extremely professional and caring. My root canal treatment was completely painless. Highly recommended!",
      stars: 5,
      date: "1 week ago"
    },
    {
      name: "Priya Chakraborty",
      location: "Shalimar, Howrah",
      text: "Very hygienic clinic with extremely friendly staff. They explain every treatment cost and diagnostic procedure clearly.",
      stars: 5,
      date: "2 weeks ago"
    },
    {
      name: "Animesh Roy",
      location: "Mill Gate, Howrah",
      text: "Excellent treatment and wonderful experience. The laser gum contouring was extremely fast and comfortable.",
      stars: 5,
      date: "1 month ago"
    },
    {
      name: "Saurav Das",
      location: "Howrah Town",
      text: "One of the best dental clinics in Howrah. Modern equipment, autoclaved tools, and Dr. Chatterjee explains everything patiently.",
      stars: 5,
      date: "2 months ago"
    }
  ];

  return (
    <section className="py-20 bg-[#F8FCFD] px-6 border-b border-[#EAF8FB]">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Core Statistics & Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left panel: Overall ratings */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <span className="text-xs bg-[#EAF8FB] border border-[#0097A7]/10 text-[#0097A7] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Patient Testimonials</span>
            <h2 className="text-3xl font-extrabold font-sans text-[#0F172A] tracking-tight leading-tight">
              What Our Happy Patients Say
            </h2>
            
            {/* Trust badge */}
            <div className="p-6 bg-white border border-[#EAF8FB] rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div>
                <span className="block text-2xl font-black text-[#0F172A] font-sans">4.7 Out of 5.0</span>
                <span className="block text-xs text-slate-400 mt-1">Average rating across 304+ verified Google reviews</span>
              </div>
            </div>

            <p className="text-[#556B72] text-xs leading-relaxed">
              Every review listed here is sourced from real, active patients in Howrah who completed treatment plans at our Andul Road surgery.
            </p>

            <button 
              id="testimonial-review-btn"
              onClick={onLeaveReviewClick}
              className="w-full py-4 bg-[#0097A7] hover:bg-[#00BCD4] text-white font-extrabold rounded-full text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#0097A7]/20"
            >
              <Smile className="w-4 h-4 text-[#26C6DA]" />
              <span>Leave a Clinic Review</span>
            </button>

          </div>

          {/* Right panel: reviews grid scrollable */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reviews.map((r, idx) => (
              <div 
                key={idx}
                className="bg-white border border-[#EAF8FB] p-6 rounded-3xl shadow-sm text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{r.date}</span>
                  </div>

                  <p className="text-[#556B72] text-xs italic mt-4 leading-relaxed">
                    "{r.text}"
                  </p>
                </div>

                <div className="border-t border-[#EAF8FB] pt-4 mt-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#EAF8FB] text-[#0097A7] font-black rounded-lg text-xs flex items-center justify-center">
                    {r.name.substring(0, 1)}
                  </div>
                  <div>
                    <span className="block font-bold text-[#0F172A] text-xs">{r.name}</span>
                    <span className="block text-[10px] text-slate-400">{r.location}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
