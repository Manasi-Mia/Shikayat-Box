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

### Admin navigation
The admin taskbar contains:

- **Dashboard** — opens the four workspace boxes: Insights, Issue Galaxy, Society Notices, and Society Chat.
- **Issues** — opens the dedicated categorized clickable issue directory.
- **Notifications**
- **Reminders**

Dashboard and Issues are controlled by the active React navigation tab so they cannot render each other's page accidentally.

### Production deployment
The Vercel production deployment is intended to track the repository's `main` branch. The latest source changes are committed to `main`; if the Vercel dashboard does not show the newest commit, manually create a deployment from the `main` branch in Vercel.

---

## Issue directory
Admin Issues groups complaints by type. Each issue is a clickable list item showing how many residents reported the same issue; selecting it opens the resident names, wing and flat numbers, with access to the underlying complaint.

## Dashboard workspaces
- **Insights** — AI patterns and analytics
- **Issue Galaxy** — dark navy constellation-style issue visualization
- **Society Notices** — create and publish targeted notices
- **Society Chat** — society-wide community conversation

## Resident experience
Residents can report complaints, track ongoing and solved issues, receive notifications, read targeted Society Notices, use the App Manual, and participate in Society Chat.

## Languages
The interface supports English, Hindi, Marathi, Telugu, Gujarati, Punjabi, and Bengali, with language preference persistence and multilingual/Hinglish complaint input.

## Authentication
Residents register/login using their resident details and password. Admins use a separate admin login. Authentication is role-based and passwords must not be stored in plain text.
