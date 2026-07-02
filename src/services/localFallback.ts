import { Appointment, ContactMessage, Subscriber, PatientReview, AdminNotification } from "../types";
import { TriggeredEmail } from "./emailService";

// Helper to check if Firebase is likely blocked or offline
export function isFirebaseOffline(): boolean {
  return localStorage.getItem("toothcare_force_local") === "true";
}

export function setForceLocalMode(enabled: boolean) {
  if (enabled) {
    localStorage.setItem("toothcare_force_local", "true");
  } else {
    localStorage.removeItem("toothcare_force_local");
  }
}

// Local Storage Helper Utilities
export const localDb = {
  getAppointments(): Appointment[] {
    const data = localStorage.getItem("toothcare_appointments");
    return data ? JSON.parse(data) : [];
  },
  
  saveAppointment(appointment: Appointment) {
    const list = this.getAppointments();
    // Avoid duplicates
    if (!list.some(a => a.id === appointment.id)) {
      list.unshift(appointment);
      localStorage.setItem("toothcare_appointments", JSON.stringify(list));
    }
  },

  updateAppointment(appointment: Appointment) {
    const list = this.getAppointments();
    const index = list.findIndex(a => a.id === appointment.id);
    if (index !== -1) {
      list[index] = appointment;
      localStorage.setItem("toothcare_appointments", JSON.stringify(list));
    }
  },

  deleteAppointment(id: string) {
    const list = this.getAppointments();
    const updated = list.filter(a => a.id !== id);
    localStorage.setItem("toothcare_appointments", JSON.stringify(updated));
  },

  getContacts(): ContactMessage[] {
    const data = localStorage.getItem("toothcare_contacts");
    return data ? JSON.parse(data) : [];
  },

  saveContact(contact: ContactMessage) {
    const list = this.getContacts();
    if (!list.some(c => c.id === contact.id)) {
      list.unshift(contact);
      localStorage.setItem("toothcare_contacts", JSON.stringify(list));
    }
  },

  updateContactStatus(id: string, status: "unread" | "read" | "replied") {
    const list = this.getContacts();
    const item = list.find(c => c.id === id);
    if (item) {
      item.status = status;
      localStorage.setItem("toothcare_contacts", JSON.stringify(list));
    }
  },

  deleteContact(id: string) {
    const list = this.getContacts();
    const updated = list.filter(c => c.id !== id);
    localStorage.setItem("toothcare_contacts", JSON.stringify(updated));
  },

  getSubscribers(): Subscriber[] {
    const data = localStorage.getItem("toothcare_subscribers");
    return data ? JSON.parse(data) : [];
  },

  saveSubscriber(subscriber: Subscriber) {
    const list = this.getSubscribers();
    if (!list.some(s => s.email === subscriber.email)) {
      list.unshift(subscriber);
      localStorage.setItem("toothcare_subscribers", JSON.stringify(list));
    }
  },

  deleteSubscriber(id: string) {
    const list = this.getSubscribers();
    const updated = list.filter(s => s.id !== id);
    localStorage.setItem("toothcare_subscribers", JSON.stringify(updated));
  },

  getReviews(): PatientReview[] {
    const data = localStorage.getItem("toothcare_reviews");
    return data ? JSON.parse(data) : [];
  },

  saveReview(review: PatientReview) {
    const list = this.getReviews();
    if (!list.some(r => r.id === review.id)) {
      list.unshift(review);
      localStorage.setItem("toothcare_reviews", JSON.stringify(list));
    }
  },

  deleteReview(id: string) {
    const list = this.getReviews();
    const updated = list.filter(r => r.id !== id);
    localStorage.setItem("toothcare_reviews", JSON.stringify(updated));
  },

  getNotifications(): AdminNotification[] {
    const data = localStorage.getItem("toothcare_notifications");
    return data ? JSON.parse(data) : [];
  },

  saveNotification(notification: AdminNotification) {
    const list = this.getNotifications();
    if (!list.some(n => n.id === notification.id)) {
      list.unshift(notification);
      localStorage.setItem("toothcare_notifications", JSON.stringify(list));
    }
  },

  markNotificationRead(id: string) {
    const list = this.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      localStorage.setItem("toothcare_notifications", JSON.stringify(list));
    }
  },

  deleteNotification(id: string) {
    const list = this.getNotifications();
    const updated = list.filter(n => n.id !== id);
    localStorage.setItem("toothcare_notifications", JSON.stringify(updated));
  },

  getTriggeredEmails(): any[] {
    const data = localStorage.getItem("toothcare_emails");
    return data ? JSON.parse(data) : [];
  },

  saveTriggeredEmail(email: any) {
    const list = this.getTriggeredEmails();
    if (!list.some(e => e.id === email.id)) {
      list.unshift(email);
      localStorage.setItem("toothcare_emails", JSON.stringify(list));
    }
  }
};

// Realistic mock seed data in case the workspace needs a fallback representation immediately
export const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: "tc_7ab32f10",
    patientName: "Arjun Banerjee",
    patientEmail: "arjun.b@gmail.com",
    patientPhone: "+91 98300 12345",
    treatment: "Root Canal Treatment",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    time: "10:30 AM",
    message: "Severe pain in lower right molar. Please check.",
    status: "pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "tc_9bc43e21",
    patientName: "Priya Sen",
    patientEmail: "priya.sen@outlook.com",
    patientPhone: "+91 84201 98765",
    treatment: "Digital Dental Implants",
    date: new Date(Date.now() + 172800000).toISOString().split("T")[0], // In 2 days
    time: "02:00 PM",
    message: "Consultation for front tooth implant.",
    status: "pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "tc_1ef45f89",
    patientName: "Rajesh Mukherjee",
    patientEmail: "rajesh.m@yahoo.com",
    patientPhone: "+91 90070 54321",
    treatment: "Laser Teeth Whitening",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
    time: "11:00 AM",
    message: "Need instant wedding whitening session.",
    status: "completed",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    adminNotes: "Session highly successful. Achieved 3 shades lighter. Patient extremely happy.",
    reviewRequested: true
  },
  {
    id: "tc_4cd90a32",
    patientName: "Meera Das",
    patientEmail: "meera.das@gmail.com",
    patientPhone: "+91 94330 99001",
    treatment: "Pediatric Suites",
    date: new Date().toISOString().split("T")[0], // Today
    time: "04:30 PM",
    message: "First routine dental checkup for my 6-year-old child.",
    status: "pending",
    createdAt: new Date().toISOString()
  }
];

export const SEED_CONTACTS: ContactMessage[] = [
  {
    id: "con_2d3f4e",
    name: "Subhashish Roy",
    email: "subhashish.r@gmail.com",
    phone: "09831122334",
    message: "Do you have EMI options available for full-mouth dental implants? What is the expected recovery duration?",
    createdAt: new Date(Date.now() - 100000000).toISOString(),
    status: "unread"
  },
  {
    id: "con_5a6b7c",
    name: "Dr. Ananya Bose",
    email: "ananya.bose@gmail.com",
    phone: "09876543210",
    message: "Hi, I am interested in referring a pediatric patient for complex orthodontic alignment. Please let me know who to coordinate with.",
    createdAt: new Date(Date.now() - 200000000).toISOString(),
    status: "read"
  }
];

export const SEED_SUBSCRIBERS: Subscriber[] = [
  { id: "sub_1", email: "amit.paul@gmail.com", subscribedAt: new Date(Date.now() - 400000000).toISOString() },
  { id: "sub_2", email: "ruma.chowdhury@outlook.com", subscribedAt: new Date(Date.now() - 300000000).toISOString() },
  { id: "sub_3", email: "sourav.dutta@yahoo.co.in", subscribedAt: new Date(Date.now() - 200000000).toISOString() }
];

export const SEED_REVIEWS: PatientReview[] = [
  {
    id: "rev_1",
    patientName: "Deepak Sharma",
    rating: 5,
    comment: "Excellent experience! Doctor took the time to explain the procedure and it was absolutely painless.",
    source: "google",
    createdAt: new Date(Date.now() - 500000000).toISOString()
  },
  {
    id: "rev_2",
    patientName: "Srabanti Ghosal",
    rating: 5,
    comment: "Highly professional dental clinic in Howrah. Very clean, sterile environment. Loved the laser teeth whitening results!",
    source: "google",
    createdAt: new Date(Date.now() - 400000000).toISOString()
  },
  {
    id: "rev_3",
    patientName: "Debasis Chatterjee",
    rating: 3,
    comment: "The treatment was good, but the waiting room was a bit crowded during peak evening hours.",
    source: "private",
    createdAt: new Date(Date.now() - 300000000).toISOString()
  }
];

export const SEED_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "not_1",
    type: "new_appointment",
    title: "⚡ New Appointment Booked",
    message: "Meera Das scheduled a session for Pediatric Suites on today's slot.",
    time: new Date().toISOString(),
    read: false
  },
  {
    id: "not_2",
    type: "new_contact",
    title: "✉️ Website Inquiry Submitted",
    message: "Subhashish Roy has sent a clinical message regarding EMI options.",
    time: new Date(Date.now() - 100000000).toISOString(),
    read: false
  }
];

export function initializeLocalDbIfEmpty() {
  if (!localStorage.getItem("toothcare_appointments")) {
    localStorage.setItem("toothcare_appointments", JSON.stringify(SEED_APPOINTMENTS));
  }
  if (!localStorage.getItem("toothcare_contacts")) {
    localStorage.setItem("toothcare_contacts", JSON.stringify(SEED_CONTACTS));
  }
  if (!localStorage.getItem("toothcare_subscribers")) {
    localStorage.setItem("toothcare_subscribers", JSON.stringify(SEED_SUBSCRIBERS));
  }
  if (!localStorage.getItem("toothcare_reviews")) {
    localStorage.setItem("toothcare_reviews", JSON.stringify(SEED_REVIEWS));
  }
  if (!localStorage.getItem("toothcare_notifications")) {
    localStorage.setItem("toothcare_notifications", JSON.stringify(SEED_NOTIFICATIONS));
  }
}
