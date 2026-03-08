# 📝 TodoApp v2 — Glassmorphic Productivity Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-Utility--First-38B2AC?logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Firebase-orange" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

A modern, high-performance task management application built with **Next.js 16 (App Router)** and **Firebase 11**.
TodoApp v2 delivers a sleek **Glassmorphism-inspired UI**, real-time data synchronization, and secure authentication to provide a smooth productivity experience across desktop and mobile devices.

---

## 🚀 Project Status

**MVP (Minimum Viable Product)**

The current release includes all core functionality required for a production-ready task management dashboard.
The application is fully responsive and optimized for smooth performance across modern devices.

Performance testing has been done on **Poco X3 Pro (120Hz)** to ensure a fluid user experience.

<img src="https://img.shields.io/badge/Live-Demo-brightgreen?logo=vercel" /> https://todoapp-v2-red.vercel.app

---

## ✨ Key Features

### 🔐 Smart Authentication

- Secure **Email/Password authentication**
- **Google OAuth login**
- Firebase Authentication integration

### ⚡ Real-Time Task Management

- Create, read, update, and delete tasks
- Instant **Firestore real-time synchronization**
- Task status toggle (Complete / Incomplete)

### 👤 Personalized User Profiles

- Custom username system
- Secure password update with confirmation validation
- Dedicated user profile page

### 🎨 Modern Glassmorphism UI

- Clean translucent design language
- Built with **Tailwind CSS v4**
- Responsive layout for mobile and desktop

### 🔒 User-Scoped Data Security

- Firestore **Security Rules** enforce strict data isolation
- Users can only access their own tasks and profile data

### ⚙️ Optimized Performance

- Powered by **Turbopack**
- GPU-accelerated CSS effects
- Optimized for smooth interactions on mobile devices

---

## 🛠️ Tech Stack

| Layer          | Technology                               |
| -------------- | ---------------------------------------- |
| **Frontend**   | Next.js 16 (App Router), React 18+       |
| **Styling**    | Tailwind CSS v4, Lucide Icons            |
| **Backend**    | Firebase Authentication, Cloud Firestore |
| **Tooling**    | TypeScript, Turbopack                    |
| **Deployment** | Vercel                                   |

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Samit_08/todoapp-v2.git
cd todoapp-v2
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env.local` file in the project root and add your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Then open:

```
http://localhost:3000
```

---

## 🧩 Project Architecture

The project follows a modular structure using the `src/` directory pattern for better scalability and maintainability.

```
src/
 ├── app/
 │   ├── dashboard/      # Task management dashboard
 │   ├── auth/           # Login & Signup pages
 │   ├── profile/        # User profile page
 │   ├── layout.tsx      # Root layout
 │   └── page.tsx        # Landing / Hero page
 │
 ├── components/         # Reusable UI components (Navbar, TaskCard, Forms, etc.)
 ├── context/            # React Context providers (AuthContext, global state)
 ├── lib/                # Firebase initialization and utility functions
 └── services/           # Firestore CRUD logic and API abstraction
```

This structure separates **UI components, business logic, and services**, making the application easier to maintain and scale as new features are added.

---

## 🗺️ Roadmap

Planned improvements and future features:

- [ ] Push Notifications for task reminders
- [ ] Task Category Tags (Work, Personal, Study)
- [ ] Dark / Light Mode Toggle
- [ ] Task Priority Levels
- [ ] Progressive Web App (PWA) support
- [ ] Native Mobile App (Exploring **React Native** or **Godot Engine**)

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  <b>Samit_08</b><br/>
  <a href="https://github.com/almustansir">GitHub Profile</a> •
  <a href="https://github.com/almustansir/todoapp-v2">Project Repository</a>
</p>

<p align="center">
  If you found this useful, consider ⭐ starring the repository.
</p>

---
