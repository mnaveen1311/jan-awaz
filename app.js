// === COUNTER ANIMATION ===
function animateCounters() {
  document.querySelectorAll('.num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString('en-IN');
    }, 16);
  });
}

// === TOAST ===
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast) return;
  toast.querySelector('.toast-icon').textContent = type === 'success' ? '✅' : '❌';
  toast.className = 'toast ' + type;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// === NAVBAR SCROLL ===
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,.08)' : 'none';
});

// === INTERSECTION OBSERVER for Cards ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = 1; e.target.style.transform = 'translateY(0)'; }});
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  // Animate counters
  animateCounters();

  // Animate cards
  document.querySelectorAll('.card, .step, .portal-card, .dash-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity .5s ease ${i*0.08}s, transform .5s ease ${i*0.08}s`;
    observer.observe(el);
  });
});

// === BACKEND API STUBS ===
// These functions represent the backend API calls.
// In production, replace with actual fetch() calls to your server.
const API = {
  baseURL: '/api',

  async sendOTP(mobile) {
    // POST /api/auth/send-otp
    return { success: true, message: 'OTP sent' };
  },

  async verifyOTP(mobile, otp) {
    // POST /api/auth/verify-otp
    return { success: true, token: 'jwt_token_here' };
  },

  async submitGrievance(data) {
    // POST /api/grievances
    return { success: true, refId: 'JA' + Date.now().toString().slice(-8) };
  },

  async trackGrievance(refId) {
    // GET /api/grievances/:refId
    return { success: true, grievance: null };
  },

  async getMyGrievances(mobile, token) {
    // GET /api/grievances?mobile=...
    return { success: true, grievances: [] };
  },

  async updateGrievance(refId, status, remarks, token) {
    // PATCH /api/grievances/:refId
    return { success: true };
  },

  async submitFeedback(data) {
    // POST /api/feedback
    return { success: true };
  },

  async sendReminder(refId, mobile) {
    // POST /api/reminders
    return { success: true };
  }
};

/*
==============================================
BACKEND STRUCTURE (Node.js + Express)
==============================================

POST   /api/auth/send-otp         — Send OTP to mobile
POST   /api/auth/verify-otp       — Verify OTP, return JWT
POST   /api/auth/login             — Officer login (username/password)

GET    /api/grievances             — List grievances (officer, filtered)
GET    /api/grievances/:refId      — Get single grievance + timeline
POST   /api/grievances             — Submit new grievance (citizen)
PATCH  /api/grievances/:refId      — Update status, add timeline entry (officer)

POST   /api/reminders              — Send reminder for overdue grievance
POST   /api/feedback               — Submit resolution feedback

GET    /api/stats                  — Dashboard statistics
GET    /api/departments            — List departments
GET    /api/districts/:state       — List districts by state

Database Schema (PostgreSQL):
  citizens: id, name, mobile, email, created_at
  grievances: id, ref_id, citizen_id, department, category, subject, description, state, district, status, created_at
  timeline: id, grievance_id, action, remarks, officer_id, created_at
  officers: id, employee_id, name, department, password_hash
  feedback: id, grievance_id, rating, resolved, comments, created_at
  reminders: id, grievance_id, sent_at

SMS Integration: Twilio / MSG91 / Fast2SMS
File Storage: AWS S3 / Local filesystem
Auth: JWT tokens with refresh
==============================================
*/
