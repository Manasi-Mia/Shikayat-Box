# SHIKAYAT BOX
### Society Issue Intelligence & Resolution Center
> **"Turn messy complaints into clear action."**

SHIKAYAT BOX is a society complaint intelligence and resolution platform that converts resident complaints into structured, prioritized issues, detects related complaints, supports SLA workflows, and helps residents and administrators track resolution.

---

## Current Experience

### Resident navigation
The resident taskbar is intentionally minimal:

- **Home**
- **Ongoing Issues**
- **Solved Issues**
- **Notifications**
- **Profile**

**Report an Issue** and **My Issues** are accessed from Home feature boxes rather than the taskbar.

### Resident Home
The Home screen provides clickable feature boxes for:

- **Report an Issue**
- **My Issues**
- **App Manual** — visual, icon-led instructions for using SHIKAYAT BOX
- **Society Notices**
- **Society Chat**

The resident UI uses a **tomato-red / pink / white** visual direction, rounded feature boxes, clear Lucide icons, large touch targets and responsive mobile layouts.

### Resident issue views
**Ongoing Issues** and **Solved Issues** use grouped issue views. A resident can select an issue to see how many residents reported the same issue and available wing/flat information, instead of navigating a cluttered grid of complaint cards.

### Multilingual support
The interface is designed to support:

- English
- Hindi
- Marathi
- Telugu
- Gujarati
- Punjabi
- Bengali

Complaints can also be submitted in multiple languages and Hinglish, with language preference support.

---

## Admin Experience

### Admin taskbar
The admin taskbar contains only:

- **Dashboard**
- **Issues**
- **Notifications**
- **Reminders**

### Admin Dashboard
The Dashboard is a clean workspace launcher. Instead of displaying the full issue wall, it provides clickable boxes for:

- **Issue Galaxy**
- **Insights**
- **Society Notices**
- **Society Chat**

### Admin Issues
The previous dense four-column Kanban-style layout has been replaced with **categorized clickable lists**.

Issues are segregated by type/category. Each entry shows the issue and the number of residents reporting it. Selecting an issue opens the affected residents and their available wing/flat details.

This keeps the admin Issues section clean and information-dense without repeated large complaint cards.

### Issue Galaxy
Issue Galaxy uses a **dark navy / deep-blue galaxy theme**. Complaints appear as star-like nodes in a constellation layout, with relationships between related complaints and Master Issues. Nodes can be selected to inspect complaint and location information.

---

## Authentication

### Resident
Registration fields:

- Mr / Mrs / Ms
- Full name
- Phone number
- Wing
- Flat number
- Password

Login uses **phone number + password**.

### Admin
Separate admin authentication uses **Admin ID / phone + password** with role-based access.

### Demo accounts
The project includes configured demo resident and admin accounts for evaluation. The actual credentials should be kept out of the public repository and provided through the private deployment/demo instructions.

- Demo resident: **Mrs. Sunita Sharma**, B Wing, B-402
**Resident demo**
Phone: 9820144521
Password: demo1234
- Demo admin: **Priya Nair**, Society Secretary, Admin ID **ADMIN-001**
**Details Admin demo**
Admin ID: ADMIN-001
Password: demo1234

> Do not commit passwords, phone credentials, session secrets, MongoDB credentials or API keys to this public README or repository.

---

## Core Capabilities

- Multilingual AI complaint understanding
- English, Hindi, Devanagari and Hinglish complaint handling
- Duplicate/related complaint detection
- Master Issues and issue clustering
- SLA countdown and escalation
- Resolution evidence and resident verification
- Categorized resident/admin issue lists
- **Issue Galaxy** constellation visualization
- **Society Notices** with targeted audiences and scheduling
- **Society Chat** for members
- In-app **Notifications**
- Admin **Reminders** with Upcoming / In Progress / Completed / Overdue states
- Mobile-first responsive UI
- Scroll-based motion and micro-interactions
- `prefers-reduced-motion` support

### Society Notices
Admins can create notices with title, description, date/time, priority and target audience. Notices can target the entire society, wing, floor or flat and can be published immediately or scheduled.

### Society Chat
A dedicated Society Chat section is available to members and is accessible through the resident Home and admin Dashboard workspaces.

---

## Architecture & Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB |
| AI | Pluggable LLM integration + built-in NLP fallback |
| Deployment | GitHub + Vercel |

### MongoDB entities
The persistent backend is designed around entities such as:

- Users
- Complaints
- Master Issues
- Timeline events
- Notifications
- Society Notices
- Reminders
- Society Chat messages
- Language preferences

---

## Environment & Security

Production configuration is supplied through server-side environment variables, including the MongoDB connection and session configuration.

**Never commit actual secret values to GitHub.** Configure production secrets in **Vercel → Project → Settings → Environment Variables**.

Passwords must be securely hashed in production. Residents should only access permitted personal information, while admins receive the operational access required for society management.

The core application does not require a WhatsApp API.

---

## Vercel Deployment

The project is connected to the GitHub `main` branch for Vercel deployment. New commits can trigger a new Vercel deployment automatically.

For production:

1. Push changes to `main`.
2. Confirm the Vercel deployment starts.
3. Configure required environment variables in Vercel.
4. Wait for the deployment to become **Ready**.
5. Test resident and admin authentication and the major workflows.

---

## Design Direction

### Resident
**Tomato red + pink + white** with a friendly, accessible, mobile-first interface.

### Admin
Minimal navigation, clean categorized issue lists and dedicated workspace boxes.

### Issue Galaxy
**Dark navy / deep blue** with star-like complaint nodes and constellation-style connections.

### Accessibility
- Clear labels and icons
- Large touch targets
- Responsive layouts
- Loading, empty and error states
- Reduced-motion support
- Minimal visual clutter

---

## Product Journey

**REPORT → UNDERSTAND → PRIORITIZE → ACT → NOTIFY → RESOLVE → VERIFY → PREVENT**

---

**SHIKAYAT BOX**  
*Ek page, aapki baat. Seedha hum tak.*
