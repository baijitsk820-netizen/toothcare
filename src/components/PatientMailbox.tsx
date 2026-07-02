import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { TriggeredEmail } from "../services/emailService";
import { Mail, X, Inbox, ChevronRight, Eye, Sparkles } from "lucide-react";

export default function PatientMailbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [emails, setEmails] = useState<TriggeredEmail[]>([]);
  const [selectedMail, setSelectedMail] = useState<TriggeredEmail | null>(null);

  // Read dispatched emails in real-time
  useEffect(() => {
    const q = query(collection(db, "triggered_emails"), orderBy("sentAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: TriggeredEmail[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as TriggeredEmail);
      });
      setEmails(items);
    }, (err) => {
      console.warn("Using in-memory mailbox fallback", err);
      // Fallback from global object
      const updateFallback = () => {
        const list = (window as any).__simulated_mailbox || [];
        setEmails([...list]);
      };
      updateFallback();
      const interval = setInterval(updateFallback, 2000);
      return () => clearInterval(interval);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Floating Badge Button */}
      <button 
        id="sandbox-mailbox-toggle"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-full p-4 shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-[#0097A7]/20 group"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#26C6DA] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0097A7]"></span>
        </span>
        <Mail className="w-5 h-5 text-[#26C6DA] group-hover:rotate-12 transition-transform" />
        <span className="text-xs tracking-wide uppercase">Email Sandbox ({emails.length})</span>
      </button>

      {/* Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-50 shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden font-sans animate-slide-in">
          
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#0097A7]/10 rounded-xl flex items-center justify-center text-[#26C6DA]">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  Simulated Mailbox Sandbox
                  <span className="text-[10px] bg-[#0097A7]/20 text-[#26C6DA] px-1.5 py-0.5 rounded-full font-bold">PREVIEW</span>
                </h3>
                <p className="text-slate-400 text-[10px] mt-0.5">View real-time responsive HTML email templates</p>
              </div>
            </div>
            <button 
              id="sandbox-mailbox-close"
              onClick={() => {
                setIsOpen(false);
                setSelectedMail(null);
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Email Log Content List */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {selectedMail ? (
              // Individual Mail Render Stage
              <div className="h-full flex flex-col bg-white">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                  <button 
                    onClick={() => setSelectedMail(null)}
                    className="text-xs font-bold text-[#0097A7] hover:text-[#00BCD4] flex items-center gap-1"
                  >
                    ← Back to Sandbox List
                  </button>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded">DELIVERED</span>
                </div>

                <div className="p-4 border-b border-slate-100 shrink-0">
                  <p className="text-xs text-slate-400">Recipient: <strong className="text-slate-700">{selectedMail.recipientName} ({selectedMail.recipient})</strong></p>
                  <h4 className="font-bold text-slate-800 text-sm mt-1">{selectedMail.subject}</h4>
                  <p className="text-[9px] text-slate-400 mt-1">Dispatched at {new Date(selectedMail.sentAt).toLocaleString()}</p>
                </div>

                {/* Branded Responsive Render Frame */}
                <div className="flex-1 bg-slate-100 p-4 overflow-hidden">
                  <iframe 
                    title="Sandbox Email Content"
                    srcDoc={selectedMail.htmlContent}
                    className="w-full h-full bg-white rounded-xl shadow-inner border border-slate-200"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            ) : (
              // List layout
              <div className="divide-y divide-slate-100 overflow-y-auto h-full flex-1">
                {emails.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 h-full flex flex-col justify-center items-center space-y-3">
                    <Mail className="w-12 h-12 text-slate-200" />
                    <p className="font-bold text-slate-700 text-sm">Your Sandbox Mailbox is Empty</p>
                    <p className="text-xs max-w-xs mx-auto">Book an appointment, fill the contact form, or subscribe to the newsletter. The beautifully branded HTML email templates will land here instantly!</p>
                  </div>
                ) : (
                  emails.map((mail) => (
                    <div 
                      key={mail.id || Math.random()} 
                      className="p-5 hover:bg-slate-100/50 transition-colors flex items-start gap-4 cursor-pointer relative"
                      onClick={() => setSelectedMail(mail)}
                    >
                      <div className="w-9 h-9 bg-[#EAF8FB] rounded-xl flex items-center justify-center text-[#0097A7] shrink-0 mt-0.5">
                        <Mail className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-bold bg-[#EAF8FB] text-[#0097A7] px-2 py-0.5 rounded uppercase tracking-wider">
                            {mail.triggerType.replace("_", " ")}
                          </span>
                          <span className="text-[9px] text-slate-400 shrink-0">{new Date(mail.sentAt).toLocaleTimeString()}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs mt-2 truncate">{mail.subject}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">To: {mail.recipientName} ({mail.recipient})</p>
                      </div>

                      <div className="shrink-0 flex items-center self-center text-[#0097A7]">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer instruction banner */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 text-center text-[10px] text-slate-400 shrink-0 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#26C6DA] animate-pulse" />
            <span>Click any email log to preview the responsive visual template!</span>
          </div>

        </div>
      )}
    </>
  );
}
