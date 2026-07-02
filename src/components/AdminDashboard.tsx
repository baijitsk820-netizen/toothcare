import React, { useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  User,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  collection, 
  query, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { Appointment, ContactMessage, Subscriber, PatientReview, AdminNotification } from "../types";
import { emailService, TriggeredEmail } from "../services/emailService";
import { localDb, initializeLocalDbIfEmpty } from "../services/localFallback";
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  TrendingUp, 
  LogOut, 
  Lock, 
  Mail, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  Plus, 
  ChevronRight, 
  X, 
  Edit, 
  Trash2, 
  Eye, 
  Phone, 
  MapPin, 
  Download,
  Bell,
  Star
} from "lucide-react";

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [email, setEmail] = useState("admin@toothcare.com");
  const [password, setPassword] = useState("ToothCareAdmin2026");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);
  const [isUsingLocalFallback, setIsUsingLocalFallback] = useState(false);

  // Firestore Data States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [sentEmails, setSentEmails] = useState<TriggeredEmail[]>([]);

  // Filtering / Search States
  const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "contacts" | "subscribers" | "emails" | "notifications">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [treatmentFilter, setTreatmentFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Modals & Selections
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [previewEmail, setPreviewEmail] = useState<TriggeredEmail | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [adminNotesText, setAdminNotesText] = useState("");

  // Firebase Auth Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Realtime Updates (Only when authenticated)
  useEffect(() => {
    if (!adminUser) return;

    if (adminUser.uid === "local-bypass" || isUsingLocalFallback) {
      initializeLocalDbIfEmpty();
      
      const syncLocal = () => {
        setAppointments(localDb.getAppointments());
        setContacts(localDb.getContacts());
        setSubscribers(localDb.getSubscribers());
        setReviews(localDb.getReviews());
        setNotifications(localDb.getNotifications());
        setSentEmails(localDb.getTriggeredEmails());
      };

      syncLocal();

      // Setup window listener to instantly update when client books something offline
      window.addEventListener("localDbUpdated", syncLocal);
      
      // Also poll every 1s to capture actions across sections
      const pollInterval = setInterval(syncLocal, 1000);

      return () => {
        window.removeEventListener("localDbUpdated", syncLocal);
        clearInterval(pollInterval);
      };
    }

    const handleError = (section: string, err: any) => {
      console.warn(`Firestore subscription error on ${section}: `, err);
      setFirestoreError(`Firestore connection failed or database not yet created in console. Local sandbox fallback activated.`);
      setIsUsingLocalFallback(true);
    };

    // 1. Appointments Realtime
    const qAppointments = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    const unsubAppointments = onSnapshot(qAppointments, (snapshot) => {
      const items: Appointment[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      setAppointments(items);
    }, (err) => handleError("appointments", err));

    // 2. Contact Messages
    const qContacts = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
    const unsubContacts = onSnapshot(qContacts, (snapshot) => {
      const items: ContactMessage[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as ContactMessage);
      });
      setContacts(items);
    }, (err) => handleError("contacts", err));

    // 3. Newsletter Subscribers
    const qSubscribers = query(collection(db, "subscribers"), orderBy("subscribedAt", "desc"));
    const unsubSubscribers = onSnapshot(qSubscribers, (snapshot) => {
      const items: Subscriber[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Subscriber);
      });
      setSubscribers(items);
    }, (err) => handleError("subscribers", err));

    // 4. Patient Reviews
    const qReviews = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubReviews = onSnapshot(qReviews, (snapshot) => {
      const items: PatientReview[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as PatientReview);
      });
      setReviews(items);
    }, (err) => handleError("reviews", err));

    // 5. Triggered Emails (Virtual Mailbox)
    const qEmails = query(collection(db, "triggered_emails"), orderBy("sentAt", "desc"));
    const unsubEmails = onSnapshot(qEmails, (snapshot) => {
      const items: TriggeredEmail[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as TriggeredEmail);
      });
      setSentEmails(items);
    }, (err) => handleError("triggered_emails", err));

    // 6. Admin Notifications
    const qNotifications = query(collection(db, "admin_notifications"), orderBy("time", "desc"));
    const unsubNotifications = onSnapshot(qNotifications, (snapshot) => {
      const items: AdminNotification[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as AdminNotification);
      });
      setNotifications(items);
    }, (err) => handleError("admin_notifications", err));

    return () => {
      unsubAppointments();
      unsubContacts();
      unsubSubscribers();
      unsubReviews();
      unsubEmails();
      unsubNotifications();
    };
  }, [adminUser, isUsingLocalFallback]);

  // Handle Admin Authorization
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    if (password.length < 6) {
      setLoginError("Weak Password: Firebase requires the password to be at least 6 characters long to auto-register or authenticate this account.");
      setIsLoggingIn(false);
      return;
    }

    try {
      // Try to sign in
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      // If user doesn't exist, we can register them automatically to ensure smooth local deployment
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (regErr: any) {
          if (regErr.code === "auth/weak-password") {
            setLoginError("Weak Password: Firebase requires the password to be at least 6 characters long.");
          } else {
            setLoginError("Could not log in. Incorrect password or registration failed.");
          }
          console.error("Auto registration failed: ", regErr);
        }
      } else if (err.code === "auth/operation-not-allowed") {
        setLoginError("Email & Password Sign-In is disabled in your Firebase project. To enable it, open your Firebase Console, navigate to Build -> Authentication -> Sign-in method, click 'Add new provider', and enable 'Email/Password'. Alternatively, you can instantly bypass this by clicking the green button below!");
        console.error("Email/password login disabled: ", err);
      } else {
        setLoginError("Authentication failed: " + err.message + ". You can use the green bypass button below to enter the admin panel instantly!");
        console.error("Login failed: ", err);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setLoginError("Google Sign-In popup was closed before completion. If popups are blocked in the iframe preview, open the app in a new tab (click the 'Open in new tab' button at the top right of the preview) or use the green bypass button below!");
      } else {
        setLoginError("Google Sign-In failed: " + err.message + ". We recommend opening the app in a new tab, or using the green bypass button below!");
      }
      console.error("Google Sign-In failed:", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (adminUser?.uid === "local-bypass") {
        setAdminUser(null);
      } else {
        await signOut(auth);
      }
    } catch (err) {
      console.error("Logout failed: ", err);
    }
  };

  // Appointment management methods
  const handleUpdateStatus = async (appointmentId: string, status: "pending" | "completed" | "cancelled") => {
    try {
      if (adminUser?.uid === "local-bypass") {
        const targetApp = appointments.find(a => a.id === appointmentId);
        if (targetApp) {
          const updated = { ...targetApp, status };
          localDb.updateAppointment(updated);
          
          let notifType: AdminNotification["type"] = "appointment_completed";
          let notifTitle = "Appointment Completed";
          if (status === "cancelled") {
            notifType = "appointment_cancelled";
            notifTitle = "Appointment Cancelled";
          }
          
          localDb.saveNotification({
            id: "not_" + Math.random().toString(36).substring(2, 10),
            type: notifType,
            title: notifTitle,
            message: `${targetApp.patientName}'s ${targetApp.treatment} session was marked as ${status}.`,
            time: new Date().toISOString(),
            read: false
          });

          if (status === "completed" && !targetApp.reviewRequested) {
            await emailService.sendReviewRequest(targetApp);
            localDb.updateAppointment({ ...updated, reviewRequested: true });
            
            localDb.saveNotification({
              id: "not_" + Math.random().toString(36).substring(2, 10),
              type: "review_received",
              title: "Review Request Dispatched",
              message: `Feedback & Review Request sent to ${targetApp.patientName} (${targetApp.patientEmail}).`,
              time: new Date().toISOString(),
              read: false
            });
          }
          window.dispatchEvent(new Event("localDbUpdated"));
        }
        return;
      }

      const appRef = doc(db, "appointments", appointmentId);
      await updateDoc(appRef, { status });

      // Create Admin Notification
      let notifType: AdminNotification["type"] = "appointment_completed";
      let notifTitle = "Appointment Completed";
      if (status === "cancelled") {
        notifType = "appointment_cancelled";
        notifTitle = "Appointment Cancelled";
      }

      const targetApp = appointments.find(a => a.id === appointmentId);
      if (targetApp) {
        await addDoc(collection(db, "admin_notifications"), {
          type: notifType,
          title: notifTitle,
          message: `${targetApp.patientName}'s ${targetApp.treatment} session was marked as ${status}.`,
          time: new Date().toISOString(),
          read: false
        });

        // Trigger Google Review Request Email automatically when status becomes "completed"
        if (status === "completed" && !targetApp.reviewRequested) {
          const emailData = await emailService.sendReviewRequest(targetApp);
          await updateDoc(appRef, { reviewRequested: true });
          
          // Trigger a notification for review requested
          await addDoc(collection(db, "admin_notifications"), {
            type: "review_received",
            title: "Review Request Dispatched",
            message: `Feedback & Review Request sent to ${targetApp.patientName} (${targetApp.patientEmail}).`,
            time: new Date().toISOString(),
            read: false
          });
        }
      }
    } catch (err) {
      console.error("Error updating appointment status: ", err);
    }
  };

  const handleSaveNotes = async (appointmentId: string) => {
    try {
      if (adminUser?.uid === "local-bypass") {
        const targetApp = appointments.find(a => a.id === appointmentId);
        if (targetApp) {
          localDb.updateAppointment({ ...targetApp, adminNotes: adminNotesText });
          if (selectedAppointment) {
            setSelectedAppointment({ ...selectedAppointment, adminNotes: adminNotesText });
          }
          window.dispatchEvent(new Event("localDbUpdated"));
          alert("Admin notes saved successfully!");
        }
        return;
      }

      const appRef = doc(db, "appointments", appointmentId);
      await updateDoc(appRef, { adminNotes: adminNotesText });
      if (selectedAppointment) {
        setSelectedAppointment({ ...selectedAppointment, adminNotes: adminNotesText });
      }
      alert("Admin notes saved successfully!");
    } catch (err) {
      console.error("Error saving notes: ", err);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this appointment?")) return;
    try {
      if (adminUser?.uid === "local-bypass") {
        localDb.deleteAppointment(appointmentId);
        setSelectedAppointment(null);
        window.dispatchEvent(new Event("localDbUpdated"));
        return;
      }

      await deleteDoc(doc(db, "appointments", appointmentId));
      setSelectedAppointment(null);
    } catch (err) {
      console.error("Error deleting appointment: ", err);
    }
  };

  const handleSaveEditingAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    try {
      if (adminUser?.uid === "local-bypass") {
        localDb.updateAppointment(editingAppointment);
        setIsEditModalOpen(false);
        setEditingAppointment(null);
        window.dispatchEvent(new Event("localDbUpdated"));
        alert("Appointment updated successfully!");
        return;
      }

      const appRef = doc(db, "appointments", editingAppointment.id);
      await updateDoc(appRef, {
        patientName: editingAppointment.patientName,
        patientPhone: editingAppointment.patientPhone,
        patientEmail: editingAppointment.patientEmail,
        treatment: editingAppointment.treatment,
        date: editingAppointment.date,
        time: editingAppointment.time,
        message: editingAppointment.message,
      });

      setIsEditModalOpen(false);
      setEditingAppointment(null);
      alert("Appointment updated successfully!");
    } catch (err) {
      console.error("Error updating appointment: ", err);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      if (adminUser?.uid === "local-bypass") {
        localDb.markNotificationRead(id);
        window.dispatchEvent(new Event("localDbUpdated"));
        return;
      }

      await updateDoc(doc(db, "admin_notifications", id), { read: true });
    } catch (err) {
      console.error("Error updating notification: ", err);
    }
  };

  const triggerReminder = async (appointment: Appointment, type: "24h" | "2h") => {
    try {
      let emailResult;
      if (adminUser?.uid === "local-bypass") {
        if (type === "24h") {
          await emailService.send24hReminder(appointment);
          localDb.updateAppointment({ ...appointment, reminderSent24h: true });
        } else {
          await emailService.send2hReminder(appointment);
          localDb.updateAppointment({ ...appointment, reminderSent2h: true });
        }
        window.dispatchEvent(new Event("localDbUpdated"));
        alert(`Branded ${type.toUpperCase()} Email Reminder triggered and logged successfully to ${appointment.patientEmail}!`);
        return;
      }

      const appRef = doc(db, "appointments", appointment.id);

      if (type === "24h") {
        emailResult = await emailService.send24hReminder(appointment);
        await updateDoc(appRef, { reminderSent24h: true });
      } else {
        emailResult = await emailService.send2hReminder(appointment);
        await updateDoc(appRef, { reminderSent2h: true });
      }

      alert(`Branded ${type.toUpperCase()} Email Reminder triggered and logged successfully to ${appointment.patientEmail}!`);
    } catch (err) {
      console.error("Error sending reminder: ", err);
    }
  };

  // CSV Exporter for appointments
  const exportAppointmentsCSV = () => {
    const headers = ["ID", "Patient Name", "Phone", "Email", "Treatment", "Date", "Time", "Status", "Created At"];
    const rows = appointments.map(app => [
      app.id,
      app.patientName,
      app.patientPhone,
      app.patientEmail,
      app.treatment,
      app.date,
      app.time,
      app.status,
      app.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `toothcare_appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering and Searching logic
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.patientPhone.includes(searchTerm) || 
                          app.treatment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesTreatment = treatmentFilter === "all" || app.treatment === treatmentFilter;
    const matchesDate = !dateFilter || app.date === dateFilter;

    return matchesSearch && matchesStatus && matchesTreatment && matchesDate;
  });

  // Basic Stats Aggregation
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === "pending").length,
    completed: appointments.filter(a => a.status === "completed").length,
    cancelled: appointments.filter(a => a.status === "cancelled").length,
    today: appointments.filter(a => {
      const todayStr = new Date().toISOString().split("T")[0];
      return a.date === todayStr;
    }).length,
    upcoming: appointments.filter(a => {
      const todayStr = new Date().toISOString().split("T")[0];
      return a.date > todayStr && a.status === "pending";
    }).length,
    totalPatients: new Set(appointments.map(a => a.patientPhone)).size,
    subscribersCount: subscribers.length,
    reviewsCount: reviews.length,
    contactsCount: contacts.length,
    unreadContacts: contacts.filter(c => c.status === "unread").length,
    avgReviewRating: reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "4.7"
  };

  // If not authenticated, display login portal
  if (!adminUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative">
          
          <button 
            id="admin-login-close"
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="bg-gradient-to-r from-cyan-700 to-cyan-500 p-8 text-center text-white">
            <div className="mx-auto w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold font-sans">ToothCare Workspace</h2>
            <p className="text-cyan-50/80 text-sm mt-1">Authorized Administrator Portal</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {loginError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 border border-red-100 animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Admin Email</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400"><Mail className="w-4 h-4" /></span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Secret Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400"><Lock className="w-4 h-4" /></span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  required 
                />
              </div>
              <p className="text-slate-400 text-xs mt-2 italic">Note: The default login password is <strong className="text-slate-500 font-bold">ToothCareAdmin2026</strong> (prefilled). If this is the first execution, we auto-create the administrator credential block.</p>
            </div>

            <button 
              id="admin-login-submit"
              type="submit" 
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-cyan-600/10 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? "Authenticating Account..." : "Log In to Workspace"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard Layout
  return (
    <div className="fixed inset-0 z-50 flex bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 text-white">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">T</span>
            <div>
              <span className="font-bold text-base block tracking-tight">ToothCare</span>
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold font-mono">ADMIN HUB</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin profile snippet */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center font-bold text-cyan-800 uppercase">
            {adminUser.email?.substring(0, 2) || "AD"}
          </div>
          <div className="truncate">
            <span className="block font-medium text-xs text-slate-200">System Admin</span>
            <span className="block text-[10px] text-slate-400 truncate">{adminUser.email}</span>
          </div>
        </div>

        {/* Menu links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "overview" ? "bg-cyan-700 text-white shadow-md shadow-cyan-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview Stats</span>
          </button>

          <button 
            onClick={() => setActiveTab("appointments")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "appointments" ? "bg-cyan-700 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"}`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4" />
              <span>Appointments</span>
            </div>
            {stats.pending > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full">{stats.pending}</span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab("contacts")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "contacts" ? "bg-cyan-700 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"}`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries</span>
            </div>
            {stats.unreadContacts > 0 && (
              <span className="px-1.5 py-0.5 bg-cyan-400 text-slate-950 text-[10px] font-bold rounded-full">{stats.unreadContacts}</span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab("subscribers")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "subscribers" ? "bg-cyan-700 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"}`}
          >
            <Users className="w-4 h-4" />
            <span>Newsletter List</span>
          </button>

          <button 
            onClick={() => setActiveTab("emails")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "emails" ? "bg-cyan-700 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"}`}
          >
            <Mail className="w-4 h-4" />
            <span>Virtual Mailbox</span>
          </button>

          <button 
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "notifications" ? "bg-cyan-700 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"}`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4" />
              <span>System Logs</span>
            </div>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">{notifications.filter(n => !n.read).length}</span>
            )}
          </button>
        </nav>

        {/* Footer logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <button 
            id="admin-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Stage */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top header navigation inside workspace */}
        <header className="bg-white border-b border-slate-100 h-16 flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab} Workspace</h1>
            <p className="text-slate-400 text-xs mt-0.5">ToothCare Clinical Management Operations</p>
          </div>
          <div className="flex items-center gap-4">
            {isUsingLocalFallback ? (
              <span className="text-xs text-amber-700 font-medium bg-amber-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-amber-200">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                Offline Sandbox Mode
              </span>
            ) : (
              <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-100">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                Cloud Sync Active
              </span>
            )}
          </div>
        </header>

        {/* Body scrolling panel */}
        <div className="flex-1 overflow-y-auto p-8">
          {firestoreError && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm animate-fade-in text-amber-900">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 font-bold text-sm">!</div>
              <div className="text-xs space-y-1">
                <p className="font-semibold text-amber-800">Custom Firebase Database Not Yet Ready</p>
                <p className="text-slate-600">
                  Firestore could not connect to project ID <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-semibold text-amber-900">dental-ae62c</code>.
                  This is completely expected if Cloud Firestore is not yet created/enabled in your new Firebase Console project.
                </p>
                <p className="text-amber-800 font-medium">
                  💡 <strong className="font-bold">Automatic local offline sandbox mode is active!</strong> All booking schedules, customer contact logs, subscriber counts, and reviews are saved inside your browser cache so you can test and operate the entire system flawlessly.
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  To sync with the cloud database, go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline font-bold text-amber-600 hover:text-amber-800">Firebase Console</a>, open project <strong className="font-semibold">dental-ae62c</strong>, navigate to "Build &gt; Firestore Database", and click "Create Database".
                </p>
              </div>
            </div>
          )}
          
          {/* TAB 1: OVERVIEW PANEL */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Statistic widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Bookings</span>
                    <span className="block text-3xl font-extrabold text-slate-800 mt-1 font-sans">{stats.total}</span>
                    <span className="block text-cyan-600 text-xs font-medium mt-1.5">Record bookings loaded</span>
                  </div>
                  <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Today's Visits</span>
                    <span className="block text-3xl font-extrabold text-slate-800 mt-1 font-sans">{stats.today}</span>
                    <span className="block text-amber-600 text-xs font-medium mt-1.5">{stats.pending} pending treatments</span>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Unique Patients</span>
                    <span className="block text-3xl font-extrabold text-slate-800 mt-1 font-sans">{stats.totalPatients}</span>
                    <span className="block text-emerald-600 text-xs font-medium mt-1.5">{stats.completed} treatments done</span>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Google Rating</span>
                    <span className="block text-3xl font-extrabold text-slate-800 mt-1 font-sans">{stats.avgReviewRating}★</span>
                    <span className="block text-rose-600 text-xs font-medium mt-1.5">{stats.reviewsCount} total reviews logged</span>
                  </div>
                  <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                    <Star className="w-6 h-6 text-rose-500 fill-rose-500" />
                  </div>
                </div>

              </div>

              {/* Action layout bento */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left col: list of today's appointments */}
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                      <h3 className="font-bold text-slate-800">Upcoming Patient Queue</h3>
                      <p className="text-slate-400 text-xs">Today & Upcoming scheduled sessions</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab("appointments")}
                      className="text-xs text-cyan-600 hover:text-cyan-800 font-semibold flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="divide-y divide-slate-50 overflow-y-auto max-h-[400px]">
                    {appointments.filter(a => a.status === "pending").length === 0 ? (
                      <div className="p-12 text-center text-slate-400 space-y-2">
                        <CheckCircle className="w-8 h-8 text-cyan-500 mx-auto" />
                        <p className="font-medium text-slate-700">All caught up!</p>
                        <p className="text-xs">No pending appointments scheduled in the database.</p>
                      </div>
                    ) : (
                      appointments.filter(a => a.status === "pending").slice(0, 5).map(app => (
                        <div key={app.id} className="p-4 hover:bg-slate-50/50 flex items-center justify-between gap-4 transition-colors">
                          <div className="min-w-0">
                            <span className="block font-bold text-slate-800 truncate">{app.patientName}</span>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
                              <span className="font-semibold text-cyan-600">{app.treatment}</span>
                              <span>•</span>
                              <span>{app.date} at {app.time}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <button 
                              onClick={() => setSelectedAppointment(app)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors"
                            >
                              Manage
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(app.id, "completed")}
                              className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                              Complete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right col: quick statistics review and newsletter count */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col">
                  <h3 className="font-bold text-slate-800 mb-4">Database Summary</h3>
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-cyan-100 text-cyan-700 rounded-lg flex items-center justify-center font-bold text-xs">NL</span>
                        <div>
                          <span className="block font-bold text-xs text-slate-800">Newsletter Subs</span>
                          <span className="block text-[10px] text-slate-400">Marketing audience size</span>
                        </div>
                      </div>
                      <span className="font-bold text-base text-slate-800">{stats.subscribersCount}</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-rose-100 text-rose-700 rounded-lg flex items-center justify-center font-bold text-xs">RE</span>
                        <div>
                          <span className="block font-bold text-xs text-slate-800">Total Reviews</span>
                          <span className="block text-[10px] text-slate-400">Google + in-app logged</span>
                        </div>
                      </div>
                      <span className="font-bold text-base text-slate-800">{stats.reviewsCount}</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center font-bold text-xs">IN</span>
                        <div>
                          <span className="block font-bold text-xs text-slate-800">Support Inquiries</span>
                          <span className="block text-[10px] text-slate-400">Total website contact submissions</span>
                        </div>
                      </div>
                      <span className="font-bold text-base text-slate-800">{stats.contactsCount}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span>Andul Road Mill Gate, Howrah</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}


          {/* TAB 2: APPOINTMENTS WORKSPACE */}
          {activeTab === "appointments" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Filter controls */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Search bar */}
                <div className="relative w-full md:w-80">
                  <span className="absolute left-3 top-3 text-slate-400"><Search className="w-4 h-4" /></span>
                  <input 
                    type="text" 
                    placeholder="Search by name or treatment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-600">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Status:</span>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-transparent outline-none font-semibold cursor-pointer"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-600">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Date:</span>
                    <input 
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="bg-transparent outline-none font-semibold cursor-pointer"
                    />
                    {dateFilter && <button onClick={() => setDateFilter("")} className="text-slate-400 hover:text-slate-600 ml-1">×</button>}
                  </div>

                  <button 
                    onClick={exportAppointmentsCSV}
                    className="ml-auto md:ml-0 flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                </div>

              </div>

              {/* Table list of filtered appointments */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-xs font-semibold uppercase border-b border-slate-100">
                        <th className="px-6 py-4">Patient Profile</th>
                        <th className="px-6 py-4">Treatment Preference</th>
                        <th className="px-6 py-4">Schedule Slot</th>
                        <th className="px-6 py-4">Booking Status</th>
                        <th className="px-6 py-4 text-center">Action Handlers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-16 text-slate-400">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <p className="font-bold">No matching bookings found</p>
                            <p className="text-xs">Adjust filters or search parameters to view items.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map(app => (
                          <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <span className="block font-bold text-slate-800 text-sm">{app.patientName}</span>
                                <span className="block text-xs text-slate-400 mt-0.5">{app.patientPhone}</span>
                                <span className="block text-[11px] text-slate-400">{app.patientEmail}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-800">
                              {app.treatment}
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <span className="block font-semibold text-slate-800 text-xs">{app.date}</span>
                                <span className="block text-slate-400 text-xs mt-0.5">{app.time}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                app.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                                app.status === "cancelled" ? "bg-rose-50 text-rose-700" :
                                "bg-amber-50 text-amber-700"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  app.status === "completed" ? "bg-emerald-600" :
                                  app.status === "cancelled" ? "bg-rose-600" :
                                  "bg-amber-600"
                                }`}></span>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => setSelectedAppointment(app)}
                                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setEditingAppointment(app);
                                    setIsEditModalOpen(true);
                                  }}
                                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                                  title="Edit Fields"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteAppointment(app.id)}
                                  className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}


          {/* TAB 3: CUSTOMER INQUIRIES */}
          {activeTab === "contacts" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.length === 0 ? (
                  <div className="col-span-full bg-white border border-slate-100 p-12 text-center rounded-2xl text-slate-400">
                    <MessageSquare className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                    <p className="font-bold">No Contact Submissions</p>
                    <p className="text-xs">Patient inquiries will populate here once submitted.</p>
                  </div>
                ) : (
                  contacts.map(message => (
                    <div key={message.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            message.status === "unread" ? "bg-cyan-50 text-cyan-700" : "bg-slate-100 text-slate-600"
                          }`}>
                            {message.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{new Date(message.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <h4 className="font-bold text-slate-800 text-base">{message.name}</h4>
                        <p className="text-slate-400 text-xs mt-0.5">Phone: <a href={`tel:${message.phone}`} className="hover:underline">{message.phone}</a></p>
                        {message.email && <p className="text-slate-400 text-xs">Email: {message.email}</p>}

                        <p className="text-slate-600 text-sm mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                          "{message.message}"
                        </p>
                      </div>

                      <div className="mt-6 border-t border-slate-100 pt-4 flex gap-2">
                        {message.status === "unread" && (
                          <button 
                            onClick={async () => {
                              try {
                                if (adminUser?.uid === "local-bypass") {
                                  localDb.updateContactStatus(message.id, "read");
                                  window.dispatchEvent(new Event("localDbUpdated"));
                                } else {
                                  await updateDoc(doc(db, "contacts", message.id), { status: "read" });
                                }
                              } catch(e) { console.error(e); }
                            }}
                            className="flex-1 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-lg text-xs transition-colors text-center"
                          >
                            Mark Read
                          </button>
                        )}
                        <a 
                          href={`tel:${message.phone}`}
                          className="flex-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg text-xs transition-all text-center block"
                        >
                          Call Client
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}


          {/* TAB 4: NEWSLETTER SUBSCRIBERS */}
          {activeTab === "subscribers" && (
            <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800">Newsletter Subscription Log</h3>
                    <p className="text-slate-400 text-xs">Email list registered for automated promotions</p>
                  </div>
                  <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full font-bold text-xs">{subscribers.length} Emails</span>
                </div>

                <div className="divide-y divide-slate-50">
                  {subscribers.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                      <Mail className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                      <p className="font-bold">No Subscribers Registered</p>
                    </div>
                  ) : (
                    subscribers.map(sub => (
                      <div key={sub.id} className="p-4 hover:bg-slate-50/50 flex items-center justify-between transition-colors">
                        <div>
                          <span className="block font-bold text-slate-800 text-sm">{sub.email}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">Joined on {new Date(sub.subscribedAt).toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={async () => {
                            if (!confirm("Remove subscriber?")) return;
                            try {
                              if (adminUser?.uid === "local-bypass") {
                                localDb.deleteSubscriber(sub.id);
                                window.dispatchEvent(new Event("localDbUpdated"));
                              } else {
                                await deleteDoc(doc(db, "subscribers", sub.id));
                              }
                            } catch(e) { console.error(e); }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}


          {/* TAB 5: VIRTUAL MAILBOX */}
          {activeTab === "emails" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              
              {/* Left col: list of emails */}
              <div className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[600px]">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-800">Email Dispatches</h3>
                  <p className="text-slate-400 text-xs">Branded responsive HTML triggers logged</p>
                </div>
                
                <div className="divide-y divide-slate-50 overflow-y-auto flex-1">
                  {sentEmails.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 space-y-2">
                      <Mail className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-medium">No emails generated yet</p>
                      <p className="text-xs">Trigger emails by booking appointments, completing sessions, or submitting inquiries.</p>
                    </div>
                  ) : (
                    sentEmails.map(mail => (
                      <button 
                        key={mail.id} 
                        onClick={() => setPreviewEmail(mail)}
                        className={`w-full p-4 text-left hover:bg-slate-50/80 transition-colors block border-l-4 ${previewEmail?.id === mail.id ? "border-cyan-600 bg-cyan-50/30" : "border-transparent"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase">{mail.triggerType.replace("_", " ")}</span>
                          <span className="text-[9px] text-slate-400">{new Date(mail.sentAt).toLocaleTimeString()}</span>
                        </div>
                        <span className="block font-bold text-slate-800 text-xs mt-2 truncate">{mail.subject}</span>
                        <span className="block text-[11px] text-slate-400 mt-0.5">To: {mail.recipientName} ({mail.recipient})</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Right col: HTML Iframe preview */}
              <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
                {previewEmail ? (
                  <div className="h-full flex flex-col">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-slate-400">Recipient: <strong className="text-slate-700">{previewEmail.recipientName} ({previewEmail.recipient})</strong></span>
                        <h4 className="font-bold text-slate-800 text-sm mt-1">{previewEmail.subject}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded font-mono font-bold">SENT LOG OK</span>
                    </div>
                    
                    <div className="flex-1 bg-slate-100 p-4 overflow-hidden">
                      <iframe 
                        title="Branded Email Preview"
                        srcDoc={previewEmail.htmlContent}
                        className="w-full h-full bg-white rounded-xl shadow-inner border border-slate-200"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12">
                    <Eye className="w-12 h-12 text-slate-200 mb-2" />
                    <p className="font-bold">Select an email from the left column</p>
                    <p className="text-xs text-center max-w-sm">Preview the exact, responsive, beautiful CSS-designed HTML templates sent to patients and staff.</p>
                  </div>
                )}
              </div>

            </div>
          )}


          {/* TAB 6: SYSTEM LOGS / NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800">System Notification Logs</h3>
                    <p className="text-slate-400 text-xs">Real-time audit updates and actions</p>
                  </div>
                  <button 
                    onClick={async () => {
                      if (!confirm("Clear notifications?")) return;
                      // delete all notifications
                      for (const n of notifications) {
                        try {
                          if (adminUser?.uid === "local-bypass") {
                            localDb.deleteNotification(n.id);
                          } else {
                            await deleteDoc(doc(db, "admin_notifications", n.id));
                          }
                        } catch(e){}
                      }
                      if (adminUser?.uid === "local-bypass") {
                        window.dispatchEvent(new Event("localDbUpdated"));
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                  >
                    Clear All Logs
                  </button>
                </div>

                <div className="divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                      <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                      <p className="font-bold">No Audit Notifications</p>
                      <p className="text-xs">Database events will log audit trails here.</p>
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className={`p-5 flex gap-4 transition-colors ${notif.read ? "bg-white" : "bg-cyan-50/20"}`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          notif.type.includes("completed") ? "bg-emerald-50 text-emerald-600" :
                          notif.type.includes("cancelled") ? "bg-rose-50 text-rose-600" :
                          notif.type.includes("contact") ? "bg-cyan-50 text-cyan-600" :
                          "bg-amber-50 text-amber-600"
                        }`}>
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <span className="block font-bold text-slate-800 text-sm truncate">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{new Date(notif.time).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-slate-600 text-xs mt-1">{notif.message}</p>
                          
                          {!notif.read && (
                            <button 
                              onClick={() => handleMarkNotificationRead(notif.id)}
                              className="text-[10px] text-cyan-600 hover:text-cyan-800 font-bold mt-2 inline-block"
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL A: APPOINTMENT FULL DETAILS & NOTE BUILDER */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            
            <div className="bg-slate-55 bg-gradient-to-r from-cyan-800 to-cyan-600 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-cyan-200">Patient File Overview</span>
                <h3 className="text-xl font-bold font-sans mt-0.5 truncate">{selectedAppointment.patientName}</h3>
              </div>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 text-cyan-200 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[480px]">
              
              {/* Info block */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registration Log</h4>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Phone Contact</span>
                    <a href={`tel:${selectedAppointment.patientPhone}`} className="text-slate-800 font-bold hover:underline">{selectedAppointment.patientPhone}</a>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Email Address</span>
                    <span className="text-slate-800 font-semibold">{selectedAppointment.patientEmail}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-slate-400 font-medium block">Target Treatment</span>
                    <span className="text-cyan-700 font-bold">{selectedAppointment.treatment}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-slate-400 font-medium block">Date & Time Slot</span>
                    <span className="text-slate-800 font-semibold">{selectedAppointment.date} at {selectedAppointment.time}</span>
                  </div>
                </div>

                {selectedAppointment.message && (
                  <div className="border-t border-slate-200/60 pt-3 mt-3">
                    <span className="text-slate-400 font-medium text-xs block">Patient Message Note</span>
                    <p className="text-slate-600 text-xs italic mt-1 font-sans">"{selectedAppointment.message}"</p>
                  </div>
                )}
              </div>

              {/* Reminders section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">SMS / Email Reminder Triggers</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => triggerReminder(selectedAppointment, "24h")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedAppointment.reminderSent24h 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="block font-bold text-xs">24-Hour Email</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      {selectedAppointment.reminderSent24h ? "✓ Dispatched" : "Send 24h Alert"}
                    </span>
                  </button>

                  <button 
                    onClick={() => triggerReminder(selectedAppointment, "2h")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedAppointment.reminderSent2h 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="block font-bold text-xs">2-Hour Email</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      {selectedAppointment.reminderSent2h ? "✓ Dispatched" : "Send 2h Alert"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Status Update */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Update Booking Status</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "pending")}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${
                      selectedAppointment.status === "pending" ? "bg-amber-500 text-slate-950" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "completed")}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${
                      selectedAppointment.status === "completed" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Completed
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "cancelled")}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${
                      selectedAppointment.status === "cancelled" ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Cancelled
                  </button>
                </div>
                {selectedAppointment.status === "completed" && (
                  <p className="text-[10px] text-emerald-600 font-semibold italic mt-1">✓ Setting to Completed auto-triggers the Google Review Request Email Template to this patient.</p>
                )}
              </div>

              {/* Admin Notes Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doctor / Administrator Notes</h4>
                <textarea 
                  value={adminNotesText}
                  onChange={(e) => setAdminNotesText(e.target.value)}
                  placeholder="Record treatment logs, recommended next steps, patient constraints, or instructions..."
                  className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
                />
                <button 
                  onClick={() => handleSaveNotes(selectedAppointment.id)}
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl text-xs transition-colors block ml-auto"
                >
                  Save Internal Notes
                </button>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button 
                onClick={() => {
                  if(confirm("Confirm deletion?")) {
                    handleDeleteAppointment(selectedAppointment.id);
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}


      {/* MODAL B: APPOINTMENT EDIT FORM */}
      {isEditModalOpen && editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <form onSubmit={handleSaveEditingAppointment} className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">Edit Booking Profile</h3>
              <button 
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingAppointment(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Patient Name</label>
                <input 
                  type="text"
                  value={editingAppointment.patientName}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, patientName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                <input 
                  type="text"
                  value={editingAppointment.patientPhone}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, patientPhone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                <input 
                  type="email"
                  value={editingAppointment.patientEmail}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, patientEmail: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                  <input 
                    type="date"
                    value={editingAppointment.date}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time Slot</label>
                  <input 
                    type="text"
                    value={editingAppointment.time}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, time: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preferred Treatment</label>
                <select 
                  value={editingAppointment.treatment}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, treatment: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Teeth Whitening">Teeth Whitening</option>
                  <option value="Dental Implants">Dental Implants</option>
                  <option value="Root Canal Treatment">Root Canal Treatment</option>
                  <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                  <option value="Dental Checkups">Dental Checkups</option>
                  <option value="Laser Dentistry">Laser Dentistry</option>
                  <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                  <option value="Tooth Extraction">Tooth Extraction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Inquiry / Message</label>
                <textarea 
                  value={editingAppointment.message}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, message: e.target.value })}
                  className="w-full h-16 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500"
                />
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button 
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingAppointment(null);
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                Save Changes
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
