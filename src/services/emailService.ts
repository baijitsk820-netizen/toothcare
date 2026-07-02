import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Appointment, ContactMessage } from "../types";

// Custom type for triggered emails
export interface TriggeredEmail {
  id?: string;
  recipient: string;
  recipientName: string;
  subject: string;
  htmlContent: string;
  triggerType: "booking_confirmation" | "admin_notification" | "reminder_24h" | "reminder_2h" | "review_request" | "contact_admin" | "contact_patient" | "newsletter_welcome";
  sentAt: string;
}

// Styling Constants for HTML Email Templates
const BRAND_PRIMARY = "#0097A7"; // Medical Teal
const BRAND_SECONDARY = "#00BCD4";
const BRAND_TEXT = "#334155";
const BRAND_BG = "#F8FCFD";

// Base Wrapper for consistent branding
const wrapInEmailTemplate = (title: string, bodyContent: string, footerNote?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${BRAND_BG}; color: ${BRAND_TEXT}; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #EAF8FB; }
    .header { background: linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_SECONDARY}); padding: 30px 20px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 5px 0 0; font-size: 14px; opacity: 0.9; }
    .content { padding: 35px 25px; line-height: 1.6; }
    .btn { display: inline-block; padding: 12px 28px; background-color: ${BRAND_PRIMARY}; color: #ffffff !important; font-weight: 600; text-decoration: none; border-radius: 8px; margin: 20px 0; text-align: center; font-size: 15px; box-shadow: 0 4px 6px rgba(0, 151, 167, 0.2); }
    .btn-secondary { display: inline-block; padding: 10px 22px; background-color: #ffffff; color: ${BRAND_PRIMARY} !important; border: 2px solid ${BRAND_PRIMARY}; font-weight: 600; text-decoration: none; border-radius: 8px; margin: 5px; text-align: center; font-size: 14px; }
    .card { background-color: #F8FCFD; border-left: 4px solid ${BRAND_PRIMARY}; padding: 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .card-title { font-weight: 700; color: #0F172A; margin-bottom: 10px; font-size: 16px; }
    .footer { background-color: #0F172A; color: #94A3B8; padding: 25px 20px; text-align: center; font-size: 12px; }
    .footer a { color: #EAF8FB; text-decoration: underline; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
    .info-item { font-size: 14px; }
    .info-label { font-weight: 600; color: #64748B; font-size: 12px; text-transform: uppercase; }
    .info-value { color: #0F172A; font-weight: 500; }
    .stars { color: #F59E0B; font-size: 20px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ToothCare Dental Clinic</h1>
      <p>Healthy Smile. Beautiful Life.</p>
    </div>
    <div class="content">
      ${bodyContent}
    </div>
    <div class="footer">
      <p><strong>ToothCare Dental Clinic</strong></p>
      <p>Andul Road Mill Gate, Opposite Bank of India, 1st Floor, Howrah, West Bengal - 711302</p>
      <p>Call: <a href="tel:08444948408">08444948408</a> | Emergency: <a href="tel:08444948408">08444948408</a></p>
      <p style="margin-top: 15px; font-size: 11px; opacity: 0.6;">
        ${footerNote || "This is an automated notification. Please do not reply directly to this email."}
      </p>
    </div>
  </div>
</body>
</html>
`;

export const emailService = {
  // 1. Send Booking Confirmation to Patient
  sendBookingConfirmation: async (appointment: Appointment): Promise<TriggeredEmail> => {
    const subject = `Appointment Confirmation – ToothCare Dental Clinic [Ref: ${appointment.id.substring(0, 8)}]`;
    const body = `
      <h2 style="color: #0F172A; margin-top: 0;">Thank You for Choosing ToothCare, ${appointment.patientName}!</h2>
      <p>Your dental appointment has been successfully scheduled. We look forward to welcoming you and helping you maintain a bright, healthy smile.</p>
      
      <div class="card">
        <div class="card-title">Appointment Details</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Appointment ID</div>
            <div class="info-value">#${appointment.id.substring(0, 8).toUpperCase()}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Treatment Preferred</div>
            <div class="info-value">${appointment.treatment}</div>
          </div>
          <div class="info-item" style="margin-top: 10px;">
            <div class="info-label">Date</div>
            <div class="info-value">${appointment.date}</div>
          </div>
          <div class="info-item" style="margin-top: 10px;">
            <div class="info-label">Preferred Time</div>
            <div class="info-value">${appointment.time}</div>
          </div>
        </div>
      </div>

      <h3 style="color: #0F172A; margin-bottom: 8px;">Pre-Visiting Instructions</h3>
      <ul style="margin: 0 padding-left: 20px; font-size: 14px; color: #475569;">
        <li>Please arrive at the clinic <strong>10 minutes prior</strong> to your scheduled time.</li>
        <li>Carry any previous dental reports, x-rays, or medication details.</li>
        <li>If you need to reschedule, kindly notify us at least 12 hours in advance.</li>
      </ul>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://maps.google.com/?q=Andul+Road+Mill+Gate+Howrah" class="btn" target="_blank">Get Directions on Google Maps</a>
        <br />
        <a href="tel:08444948408" class="btn-secondary">Call Clinic</a>
        <a href="https://wa.me/918444948408?text=Hello%20ToothCare%2C%20I%20have%20an%20appointment" class="btn-secondary">WhatsApp Support</a>
      </div>
    `;

    const htmlContent = wrapInEmailTemplate(subject, body);
    const emailData: TriggeredEmail = {
      recipient: appointment.patientEmail,
      recipientName: appointment.patientName,
      subject,
      htmlContent,
      triggerType: "booking_confirmation",
      sentAt: new Date().toISOString()
    };

    await logTriggeredEmail(emailData);
    return emailData;
  },

  // 2. Send Admin Booking Alert
  sendAdminNotification: async (appointment: Appointment): Promise<TriggeredEmail> => {
    const subject = `⚠️ NEW APPOINTMENT BOOKED: ${appointment.patientName} - ${appointment.treatment}`;
    const body = `
      <h2 style="color: #0F172A; margin-top: 0;">New Patient Appointment Registered</h2>
      <p>An appointment has been successfully booked online. Below are the details of the request:</p>
      
      <div class="card" style="background-color: #FEF3C7; border-left-color: #F59E0B;">
        <div class="card-title" style="color: #92400E;">Patient & Schedule Overview</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Patient Name</div>
            <div class="info-value">${appointment.patientName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Treatment</div>
            <div class="info-value">${appointment.treatment}</div>
          </div>
          <div class="info-item" style="margin-top: 10px;">
            <div class="info-label">Contact Phone</div>
            <div class="info-value"><a href="tel:${appointment.patientPhone}">${appointment.patientPhone}</a></div>
          </div>
          <div class="info-item" style="margin-top: 10px;">
            <div class="info-label">Patient Email</div>
            <div class="info-value">${appointment.patientEmail}</div>
          </div>
          <div class="info-item" style="margin-top: 10px;">
            <div class="info-label">Date</div>
            <div class="info-value">${appointment.date}</div>
          </div>
          <div class="info-item" style="margin-top: 10px;">
            <div class="info-label">Time</div>
            <div class="info-value">${appointment.time}</div>
          </div>
        </div>
        ${appointment.message ? `
        <div style="margin-top: 15px; border-top: 1px solid #FCD34D; padding-top: 10px;">
          <div class="info-label">Patient Message</div>
          <div class="info-value" style="font-style: italic;">"${appointment.message}"</div>
        </div>` : ""}
      </div>

      <div style="text-align: center; margin-top: 25px;">
        <p style="font-size: 14px; color: #64748B;">Please log into the Admin Dashboard to manage this booking.</p>
      </div>
    `;

    const htmlContent = wrapInEmailTemplate(subject, body, "Admin portal alert system.");
    const emailData: TriggeredEmail = {
      recipient: "clinic@toothcaredental.com",
      recipientName: "ToothCare Admin",
      subject,
      htmlContent,
      triggerType: "admin_notification",
      sentAt: new Date().toISOString()
    };

    await logTriggeredEmail(emailData);
    return emailData;
  },

  // 3. Send 24H Reminder
  send24hReminder: async (appointment: Appointment): Promise<TriggeredEmail> => {
    const subject = `⏰ Reminder: Your Dental Appointment Tomorrow – ToothCare`;
    const body = `
      <h2 style="color: #0F172A; margin-top: 0;">See You Tomorrow, ${appointment.patientName}!</h2>
      <p>This is a friendly reminder that you have an appointment scheduled with us in <strong>24 hours</strong>. Keeping your dental visits is the best way to keep your smile beautiful!</p>
      
      <div class="card">
        <div class="card-title">Appointment Summary</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Date</div>
            <div class="info-value">${appointment.date} (Tomorrow)</div>
          </div>
          <div class="info-item">
            <div class="info-label">Time Slot</div>
            <div class="info-value">${appointment.time}</div>
          </div>
          <div class="info-item" style="margin-top: 10px;">
            <div class="info-label">Treatment</div>
            <div class="info-value">${appointment.treatment}</div>
          </div>
          <div class="info-item" style="margin-top: 10px;">
            <div class="info-label">Address</div>
            <div class="info-value" style="font-size: 13px;">Andul Road Mill Gate, 1st Floor, Howrah</div>
          </div>
        </div>
      </div>

      <p>If you need to reschedule or have any questions, please contact us immediately so we can adjust our schedule.</p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://maps.google.com/?q=Andul+Road+Mill+Gate+Howrah" class="btn" target="_blank">Open Maps Navigation</a>
        <br />
        <a href="tel:08444948408" class="btn-secondary">Call To Reschedule</a>
      </div>
    `;

    const htmlContent = wrapInEmailTemplate(subject, body);
    const emailData: TriggeredEmail = {
      recipient: appointment.patientEmail,
      recipientName: appointment.patientName,
      subject,
      htmlContent,
      triggerType: "reminder_24h",
      sentAt: new Date().toISOString()
    };

    await logTriggeredEmail(emailData);
    return emailData;
  },

  // 4. Send 2H Reminder
  send2hReminder: async (appointment: Appointment): Promise<TriggeredEmail> => {
    const subject = `⚡ Your Appointment is in 2 Hours – ToothCare Dental Clinic`;
    const body = `
      <h2 style="color: #0F172A; margin-top: 0;">We're Ready for You, ${appointment.patientName}!</h2>
      <p>Your dental consultation is in <strong>2 hours</strong>. Our sterile rooms are fully prepared, and our doctor is looking forward to seeing you.</p>
      
      <div class="card" style="background-color: #EAF8FB;">
        <div class="card-title">Today's Appointment</div>
        <p style="margin: 5px 0;"><strong>Time:</strong> ${appointment.time} (Today)</p>
        <p style="margin: 5px 0;"><strong>Procedure:</strong> ${appointment.treatment}</p>
        <p style="margin: 5px 0;"><strong>Location:</strong> Andul Road Mill Gate, Opposite Bank of India, 1st Floor, Howrah</p>
      </div>

      <div style="text-align: center; margin-top: 25px;">
        <a href="https://maps.google.com/?q=Andul+Road+Mill+Gate+Howrah" class="btn" style="background-color: #26C6DA;" target="_blank">Direct GPS Navigation</a>
        <br />
        <a href="tel:08444948408" class="btn-secondary">Direct Call Clinic</a>
      </div>
    `;

    const htmlContent = wrapInEmailTemplate(subject, body);
    const emailData: TriggeredEmail = {
      recipient: appointment.patientEmail,
      recipientName: appointment.patientName,
      subject,
      htmlContent,
      triggerType: "reminder_2h",
      sentAt: new Date().toISOString()
    };

    await logTriggeredEmail(emailData);
    return emailData;
  },

  // 5. Send Google Review Request (triggered when admin marks appointment as Completed)
  sendReviewRequest: async (appointment: Appointment): Promise<TriggeredEmail> => {
    const subject = `Thank You for Visiting ToothCare Dental Clinic ❤️`;
    const body = `
      <h2 style="color: #0F172A; margin-top: 0; text-align: center;">Thank You, ${appointment.patientName}!</h2>
      <p>We hope you had a comfortable, painless, and pleasant experience during your recent <strong>${appointment.treatment}</strong> session at ToothCare Dental Clinic.</p>
      
      <p>Our priority is always delivering ethical, top-quality dental care with complete hygiene. Your honest feedback helps us maintain our high standard of care and guides other patients looking for trusted dentistry in Howrah.</p>
      
      <div style="text-align: center; background-color: #F8FCFD; border-radius: 12px; padding: 25px; border: 1px solid #EAF8FB; margin: 25px 0;">
        <h4 style="margin: 0 0 10px; color: #0097A7; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Rate Your Experience</h4>
        <div class="stars">★★★★★</div>
        <p style="font-size: 14px; margin-bottom: 20px; color: #475569;">If you loved our treatment, please spare 1 minute to leave us a 5-star Google Review.</p>
        <a href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK/review" class="btn" style="margin: 0; display: block;" target="_blank">Write a Google Review</a>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 13px; color: #64748B;">For other inquiries, suggestions, or private feedback:</p>
        <a href="${window.location.origin}?feedback=true&name=${encodeURIComponent(appointment.patientName)}" class="btn-secondary">Share Private Feedback</a>
        <a href="${window.location.origin}" class="btn-secondary">Book Next Visit</a>
      </div>
    `;

    const htmlContent = wrapInEmailTemplate(subject, body);
    const emailData: TriggeredEmail = {
      recipient: appointment.patientEmail,
      recipientName: appointment.patientName,
      subject,
      htmlContent,
      triggerType: "review_request",
      sentAt: new Date().toISOString()
    };

    await logTriggeredEmail(emailData);
    return emailData;
  },

  // 6. Send Contact Form Notifications
  sendContactNotifications: async (contact: ContactMessage): Promise<{ admin: TriggeredEmail, patient: TriggeredEmail }> => {
    // Admin Alert
    const adminSubject = `✉️ New Contact Form Inquiry from ${contact.name}`;
    const adminBody = `
      <h2 style="color: #0F172A; margin-top: 0;">Website Query Received</h2>
      <p>A user submitted a contact form message from the website:</p>
      
      <div class="card" style="border-left-color: #26C6DA;">
        <div class="card-title">Inquiry Details</div>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${contact.name}</p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${contact.phone}">${contact.phone}</a></p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${contact.email || "Not Provided"}</p>
        <p style="margin: 15px 0 0; font-style: italic; background-color: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #E2E8F0;">
          "${contact.message}"
        </p>
      </div>
    `;
    const adminEmail = {
      recipient: "clinic@toothcaredental.com",
      recipientName: "ToothCare Admin",
      subject: adminSubject,
      htmlContent: wrapInEmailTemplate(adminSubject, adminBody, "Inquiry Form system alert."),
      triggerType: "contact_admin" as const,
      sentAt: new Date().toISOString()
    };
    await logTriggeredEmail(adminEmail);

    // Patient Thank You Auto-reply
    const patientSubject = `We Received Your Inquiry – ToothCare Dental Clinic`;
    const patientBody = `
      <h2 style="color: #0F172A; margin-top: 0;">Hello ${contact.name},</h2>
      <p>Thank you for reaching out to ToothCare Dental Clinic. We have successfully received your inquiry and our team will get back to you within 24 hours.</p>
      
      <div class="card" style="background-color: #F8FCFD;">
        <div class="card-title">Your Message Summary</div>
        <p style="margin: 5px 0; font-style: italic; color: #475569;">"${contact.message}"</p>
      </div>

      <p>If you have an urgent toothache, bleeding, or a dental emergency, please call us directly on our hotlines for immediate advice.</p>

      <div style="text-align: center; margin-top: 25px;">
        <a href="tel:08444948408" class="btn" style="margin: 0 10px 0 0;">Call Hotlines Now</a>
        <a href="https://wa.me/918444948408" class="btn-secondary">WhatsApp Chat</a>
      </div>
    `;
    const patientEmail = {
      recipient: contact.email || "patient@example.com",
      recipientName: contact.name,
      subject: patientSubject,
      htmlContent: wrapInEmailTemplate(patientSubject, patientBody),
      triggerType: "contact_patient" as const,
      sentAt: new Date().toISOString()
    };
    if (contact.email) {
      await logTriggeredEmail(patientEmail);
    }

    return { admin: adminEmail, patient: patientEmail };
  },

  // 7. Send Newsletter Welcome
  sendNewsletterWelcome: async (email: string): Promise<TriggeredEmail> => {
    const subject = `Welcome to ToothCare Dental Clinic Newsletter 🦷`;
    const body = `
      <h2 style="color: #0F172A; margin-top: 0; text-align: center;">Welcome to Our Dental Care Family!</h2>
      <p>Thank you for subscribing to our monthly wellness and dental care newsletter! We are excited to share professional insights, oral hygiene tips, exclusive clinic updates, and preventive care reminders with you.</p>
      
      <div class="card" style="border-left-color: #10B981; background-color: #F0FDF4;">
        <div class="card-title" style="color: #15803D;">⭐️ Quick Tip for a Healthier Smile</div>
        <p style="margin: 5px 0; font-size: 14px; color: #166534;">
          Did you know brushing right before sleep is the most important brush of the day? It removes plaque and keeps harmful bacteria from multiplying overnight while saliva flow is low.
        </p>
      </div>

      <p>We are always here to help you smile with confidence. Visit us at any time for custom assessments.</p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${window.location.origin}" class="btn" style="margin: 0;">Explore Services & Bookings</a>
      </div>
    `;

    const htmlContent = wrapInEmailTemplate(subject, body);
    const emailData: TriggeredEmail = {
      recipient: email,
      recipientName: "Subscriber",
      subject,
      htmlContent,
      triggerType: "newsletter_welcome",
      sentAt: new Date().toISOString()
    };

    await logTriggeredEmail(emailData);
    return emailData;
  }
};

// Log triggered emails to Firestore so the Admin Dashboard and patient simulator can display them!
async function logTriggeredEmail(email: TriggeredEmail) {
  try {
    await addDoc(collection(db, "triggered_emails"), {
      ...email,
      sentAtTimestamp: serverTimestamp()
    });
    console.log(`[Email Dispatched] Subject: "${email.subject}" to ${email.recipient}`);
  } catch (err) {
    console.error("Failed to log triggered email to Firestore: ", err);
    // In-memory logging fallback in case database rules are updating
    const fallbackList = (window as any).__simulated_mailbox || [];
    fallbackList.unshift(email);
    (window as any).__simulated_mailbox = fallbackList;
  }
}
