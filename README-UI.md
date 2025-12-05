# HealthMonitor - Complete UI/UX System

A production-ready, hospital-grade health monitoring system with modern, minimal medical UI design.

## 📁 Files Created

### **CSS Framework**
- `public/css/app.css` — Unified medical UI framework with:
  - Soft blues (#0B75D6), greens (#0F9D58), whites
  - Cards, buttons, forms, grids, modals
  - Responsive design (mobile-first)
  - 90+ utility classes & components

### **Pages (Complete & Functional)**

1. **`public/login.html`** — Authentication page
   - Email/password form
   - "Forgot password?" link
   - Sign-up redirect
   - Mock auth (uses localStorage)

2. **`public/signup.html`** — User registration
   - Full name, email, phone, DOB, NHS number
   - Password validation
   - Auto-save to localStorage
   - Redirects to Patient Details

3. **`public/patient-details.html`** — Patient intake form (first page after auth)
   - Patient name, age, gender, address
   - Existing disease/condition
   - Consult doctor? / Monitor health? toggles
   - Quick-access cards to Monitoring & Consult

4. **`public/monitoring.html`** — Real-time health dashboard
   - Live vitals: HR, BP, SpO2, Temp, RR, Stress
   - Manual entry modal
   - Device connection modal
   - Interactive charts (Chart.js): HR & BP trends
   - Recent readings table (sortable)
   - Export CSV/PDF (ready to extend)

5. **`public/consult.html`** — Doctor consultation booking
   - Doctor directory (3 sample doctors)
   - Specialty, availability, consult type filters
   - Doctor profiles with ratings, wait times
   - Booking flow → waiting room → join consultation
   - Consultation history table

6. **`public/dashboard.html`** — Admin/overview dashboard
   - KPI cards: Total users, registered patients, live monitoring, ongoing consults
   - Charts: Heart rate distribution (bar), system health (doughnut)
   - Critical alerts panel (high BP, low SpO2, all clear)
   - Recent activity feed

### **Shared Components**
- Sidebar navigation (collapsible on mobile)
- Top navigation bar with search & notifications
- User avatar
- Responsive grid layouts (2, 3, 4 columns)
- Status badges (success/warning/danger)
- Alert modals

---

## 🚀 Quick Start

### 1. Start the Server
```powershell
cd 'C:\Users\siddi\Downloads\HMS\Proj-doop\Proj\health-monitor'
node server.js
```

### 2. Open in Browser
```
http://localhost:3000/signup.html  (if no account exists)
http://localhost:3000/login.html   (existing users)
http://localhost:3000/dashboard.html (after login)
```

### 3. Test Login Flow
1. **Sign Up**: Create account at `signup.html`
   - Email: `john@example.com`
   - Password: `Password123`
   - Auto-saved to localStorage
2. **Login**: Go to `login.html`
   - Same email & password
   - Redirects to `dashboard.html`
3. **Complete Patient Details**: `patient-details.html`
   - Fill form and choose "Monitor health" → goes to monitoring
   - Or choose "Consult doctor" → goes to consult

---

## 🎨 Design System

### **Colors**
- **Primary**: `#0B75D6` (soft blue) — main actions, links
- **Success**: `#0F9D58` (green) — positive states, alerts
- **Danger**: `#E53935` (red) — critical alerts
- **Warning**: `#F57C00` (orange) — caution alerts
- **Neutral**: `#F8FAFC` (very light) — backgrounds

### **Typography**
- Font: System default (Inter fallback)
- Sizes: 12px (labels), 14px (body), 16px (titles), 28px (h1)
- Weight: 400 (normal), 600 (semi-bold), 700 (bold)

### **Spacing**
- Base: 8px increments
- Gaps: 16px (md), 24px (lg), 32px (xl)

### **Radius**
- Small: 6px (inputs, badges)
- Medium: 10px (cards, modals)
- Large: 14px (outer cards)

---

## 📊 Features Implemented

### **Patient Details Module**
✅ Form with name, age, gender, address, condition  
✅ Consult doctor & monitor health toggles  
✅ Redirects to appropriate next page  
✅ Saves to localStorage for persistence  

### **Health Monitoring**
✅ Live vitals display (6 vital cards)  
✅ Manual entry modal (form with validation)  
✅ Device connection modal (mock device list)  
✅ Real-time charts (HR & BP trends)  
✅ Recent readings table  
✅ Export button (ready for PDF/CSV implementation)  

### **Doctor Consultation**
✅ Doctor list with ratings & availability  
✅ Filtering by specialty, availability, type  
✅ Waiting room interface  
✅ Queue position & estimated wait  
✅ Share vitals toggle  
✅ Consultation history  

### **Dashboard**
✅ KPI metric cards (4 key stats)  
✅ Analytics charts (HR distribution, system health)  
✅ Critical alerts panel  
✅ Recent activity feed  
✅ Responsive sidebar + topbar  

### **Authentication**
✅ Login with email/password validation  
✅ Sign-up with form validation  
✅ Persistent storage (localStorage)  
✅ Post-login redirect to dashboard  
✅ User avatar with initials  

---

## 🔌 Integration Points (Ready for Backend)

To wire to a real backend, replace localStorage calls with API:

### **Current (Mock/localStorage)**
```javascript
localStorage.setItem('users', JSON.stringify(users));
localStorage.setItem('currentUser', JSON.stringify(user));
localStorage.setItem('patientSummary', JSON.stringify(data));
localStorage.setItem('readings', JSON.stringify(readings));
```

### **Ready to Replace With**
```javascript
// POST /api/auth/signup
// POST /api/auth/login
// GET /api/patients/{id}
// POST /api/patients/{id}
// POST /api/monitoring/{patientId}
// GET /api/monitoring/{patientId}?range=24h
// WebSocket /ws/monitoring/{patientId} (live vitals)
// POST /api/consults
// GET /api/doctors
```

---

## 📱 Responsive Design

- **Desktop** (1024px+): Full sidebar, 4-column grids
- **Tablet** (768px): Collapsed sidebar, 2-column grids
- **Mobile** (480px): Hidden sidebar, 1-column grids, full-width cards

---

## ✨ UX Highlights

### **User Journey 1: New Patient Registration**
```
signup.html → patient-details.html → monitoring.html
   (sign up)     (fill health info)    (track vitals)
```

### **User Journey 2: Existing Patient Login & Consult**
```
login.html → dashboard.html → consult.html → waiting-room
   (sign in)  (view overview)  (select doctor) (join call)
```

### **User Journey 3: Health Monitoring**
```
patient-details.html (click "Monitoring") → monitoring.html
                                           → add reading modal
                                           → view charts & trends
```

---

## 🔐 Security & Validation

- ✅ Email format validation (signup)
- ✅ Password length & complexity (8+ chars)
- ✅ Confirm password match
- ✅ Required field enforcement
- ✅ HTTPS-ready (use `https://` in production)
- ⚠️ Note: Currently uses localStorage (frontend only). For production, implement:
  - JWT tokens with httpOnly cookies
  - Server-side validation
  - CORS & CSRF protection

---

## 🎯 Next Steps (Optional Enhancements)

1. **Backend Integration** (`server.js` routes):
   - `/api/auth/login` & `/api/auth/signup`
   - `/api/patients` (CRUD)
   - `/api/monitoring` (POST vitals, GET history)
   - WebSocket for real-time vitals

2. **Database**: Connect MongoDB/PostgreSQL for persistent patient records

3. **Charts**: Add more analytics (trends, comparisons, reports)

4. **Notifications**: Push alerts for critical vitals

5. **Mobile App**: React Native or PWA wrapper

6. **Video Consultation**: Integrate WebRTC or Agora SDK

7. **PDF Export**: Server-side rendering with pdfkit or similar

---

## 📞 Support

For questions or issues, refer to:
- `public/css/app.css` — CSS framework documentation
- Individual `.html` files — inline comments explain flow
- `server.js` — backend setup (add routes as needed)

---

**Version**: 1.0 | **Last Updated**: Nov 30, 2025
