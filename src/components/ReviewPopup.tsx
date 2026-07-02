import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { localDb } from "../services/localFallback";
import { X, Star, Heart, ShieldAlert, Send } from "lucide-react";

export default function ReviewPopup({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [step, setStep] = useState<"rating" | "routing" | "success">("rating");
  
  // Feedback details
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingSelect = (selectedRating: number) => {
    setRating(selectedRating);
    if (selectedRating >= 4) {
      // 4 or 5 stars: Excellent/Good -> Redirect to Google Review
      setStep("routing");
      // Give a slight delay before opening the new window so they understand the transition
      setTimeout(() => {
        try {
          window.open("https://g.page/r/YOUR_GOOGLE_REVIEW_LINK/review", "_blank");
        } catch (e) {}
        
        // Also log to our reviews database
        try {
          addDoc(collection(db, "reviews"), {
            patientName: name || "Anonymous Patient",
            rating: selectedRating,
            comment: "Highly rated on Google Review popup",
            source: "google",
            createdAt: new Date().toISOString()
          });
        } catch (err) {
          console.error(err);
        }

        // Always save to local fallback db for Sandbox Bypass or offline compatibility
        localDb.saveReview({
          id: "rev_" + Math.random().toString(36).substring(2, 10),
          patientName: name || "Anonymous Patient",
          rating: selectedRating,
          comment: "Highly rated on Google Review popup",
          source: "google",
          createdAt: new Date().toISOString()
        });
        window.dispatchEvent(new Event("localDbUpdated"));
        
        setStep("success");
      }, 1500);
    } else {
      // 1, 2, or 3 stars: Average/Poor -> Show private internal feedback form
      setStep("routing");
    }
  };

  const handlePrivateFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const reviewData = {
        patientName: name || "Valued Patient",
        rating: rating,
        comment: comment,
        source: "private" as const,
        createdAt: new Date().toISOString()
      };

      try {
        await addDoc(collection(db, "reviews"), reviewData);

        // Create Admin Alert for private feedback received
        await addDoc(collection(db, "admin_notifications"), {
          type: "review_received",
          title: "⚠️ Low Patient Rating Logged",
          message: `${name || "A patient"} submitted a private feedback rating of ${rating}/5 stars. Internal review recommended.`,
          time: new Date().toISOString(),
          read: false
        });
      } catch (dbErr) {
        console.warn("Firestore reviews save failed, falling back to local: ", dbErr);
      }

      // Always save to localDb to support Sandbox Bypass and offline robustness
      localDb.saveReview({
        id: "rev_" + Math.random().toString(36).substring(2, 10),
        ...reviewData
      });
      localDb.saveNotification({
        id: "not_" + Math.random().toString(36).substring(2, 10),
        type: "review_received",
        title: "⚠️ Low Patient Rating Logged",
        message: `${name || "A patient"} submitted a private feedback rating of ${rating}/5 stars. Internal review recommended.`,
        time: new Date().toISOString(),
        read: false
      });
      window.dispatchEvent(new Event("localDbUpdated"));

      setStep("success");
    } catch (err) {
      console.error("Failed to submit private review: ", err);
      setStep("success"); // Still show success so patients have a frictionless experience
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative">
        
        <button 
          id="review-popup-close"
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: INITIAL RATING SELECTION */}
        {step === "rating" && (
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-14 h-14 bg-[#EAF8FB] rounded-2xl flex items-center justify-center text-[#0097A7]">
              <Star className="w-7 h-7 fill-[#0097A7] text-[#0097A7]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#0F172A]">How was your experience?</h3>
              <p className="text-[#556B72] text-xs max-w-xs mx-auto">We value your honest feedback to continuously deliver painless, world-class dental care in Howrah.</p>
            </div>

            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  id={`review-star-${star}`}
                  key={star}
                  type="button"
                  onClick={() => handleRatingSelect(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 hover:scale-110 active:scale-95 transition-all outline-none"
                >
                  <Star 
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoveredRating || rating) 
                        ? "text-amber-400 fill-amber-400" 
                        : "text-slate-200"
                    }`} 
                  />
                </button>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 italic">Select a star rating to begin</p>
          </div>
        )}

        {/* STEP 2: ROUTING LOGIC CARD */}
        {step === "routing" && rating >= 4 && (
          <div className="p-8 text-center space-y-5 animate-fade-in">
            <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
              <Heart className="w-8 h-8 fill-emerald-500 text-emerald-500 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A]">We are so glad you loved it! ❤️</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">Your exceptional rating is being redirected to our official Google Review page. Thank you for supporting our community surgery!</p>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#0097A7]">
              <span className="w-2 h-2 bg-[#0097A7] rounded-full animate-ping"></span>
              Redirecting to Google Reviews...
            </div>
          </div>
        )}

        {step === "routing" && rating < 4 && (
          <form onSubmit={handlePrivateFeedbackSubmit} className="p-8 space-y-5 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Help Us Improve</h3>
                <p className="text-slate-400 text-[11px]">Your feedback is routed privately to our directors.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#556B72] mb-1.5">Your Name (Optional)</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sen"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white outline-none focus:ring-2 focus:ring-[#0097A7]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#556B72] mb-1.5">Please tell us what went wrong</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about your discomfort or area of improvement..."
                  className="w-full h-24 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#0097A7]/20 resize-none"
                  required
                />
              </div>
            </div>

            <button 
              id="private-feedback-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#0097A7] hover:bg-[#00BCD4] text-white font-extrabold rounded-full text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-[#0097A7]/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Sending Securely..." : "Submit Private Feedback"}</span>
            </button>
          </form>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === "success" && (
          <div className="p-8 text-center space-y-5 animate-fade-in">
            <div className="mx-auto w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
              <Star className="w-7 h-7 fill-emerald-500 text-emerald-500" />
            </div>
            
            <h3 className="text-xl font-bold text-[#0F172A]">Feedback Submitted</h3>
            <p className="text-slate-400 text-xs max-w-xs mx-auto">Thank you for helping us keep ToothCare Dental Clinic the most trusted practice in West Bengal. Your input makes a significant difference!</p>
            
            <button 
              id="review-popup-finish"
              onClick={onClose}
              className="w-full py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-full text-xs transition-colors shadow-md"
            >
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
