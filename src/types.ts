export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  treatment: string;
  date: string;
  time: string;
  message: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  adminNotes?: string;
  emailSent?: boolean;
  reminderSent24h?: boolean;
  reminderSent2h?: boolean;
  reviewRequested?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: "unread" | "read" | "replied";
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface PatientReview {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  source: "google" | "private";
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  type: "new_appointment" | "appointment_cancelled" | "appointment_completed" | "new_contact" | "new_subscriber" | "review_received";
  title: string;
  message: string;
  time: string;
  read: boolean;
}
