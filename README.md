# 🔖 Smart Bookmark App

A full-stack bookmark management application built with **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**.

This application allows users to securely log in using **Google OAuth**, manage personal bookmarks, and see real-time updates across browser tabs.

---

## 🚀 Live Demo

🌐 Live URL: https://smart-bookmark-app-topaz.vercel.app
📦 GitHub Repository: https://github.com/amitpatil005/smart-bookmark-app

---

## 🛠 Tech Stack

- **Next.js (App Router)**
- **Supabase**
  - Authentication (Google OAuth)
  - PostgreSQL Database
  - Realtime subscriptions
- **Tailwind CSS**
- **Vercel** (Deployment)

---

## ✨ Features

- 🔐 Google OAuth Authentication (No email/password)
- ➕ Add bookmarks (Title + URL)
- 🗑 Delete bookmarks
- 🔒 Private bookmarks per user (Row Level Security)
- 🔄 Real-time updates between browser tabs
- 🌍 Deployed on Vercel with live production URL

---

## 🔐 Authentication & Security

Authentication is implemented using **Supabase Google OAuth**.

Security is enforced using:

- Row Level Security (RLS)
- Database policy: auth.uid() = user_id
  This ensures:
- Users can only view their own bookmarks
- Users cannot access or modify other users’ data

---

## 🗄 Database Schema

### Table: `bookmarks`

| Column     | Type        | Description |
|------------|------------|-------------|
| id         | uuid       | Primary key |
| title      | text       | Bookmark title |
| url        | text       | Bookmark URL |
| user_id    | uuid       | References authenticated user |
| created_at | timestamp  | Auto-generated timestamp |

---

## 🔄 Real-time Functionality

Supabase Realtime subscriptions are used to listen for database changes.

If the app is opened in multiple browser tabs:
- Adding a bookmark in one tab
- Instantly updates the other tab
- No page refresh required

This is implemented using Supabase `postgres_changes` listeners.

---

## ⚙️ Environment Variables

The following environment variables are required:
NEXT_PUBLIC_SUPABASE_URL=https://essqghbscgysfqyxasak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_o_LB4tiRDlSQMNtZ4rhL4A_icWxKfei

These are configured in:

- Local `.env.local`
- Vercel Environment Variables (Production)

---

## 🚧 Challenges Faced & Solutions

### 1️⃣ OAuth Redirect Issues (Production)

**Problem:** Google OAuth redirect mismatch error after deployment.

**Solution:**  
Properly configured:
- Supabase Site URL
- Supabase Redirect URLs
- Vercel Production Domain

---

### 2️⃣ User Data Isolation

**Problem:** Ensuring bookmarks remain private per user.

**Solution:**  
- Added `user_id` column
- Enabled Row Level Security (RLS)
- Created secure database policies

---

### 3️⃣ Real-time Sync Between Tabs

**Problem:** Bookmarks were not updating automatically.

**Solution:**  
Implemented Supabase Realtime channel subscriptions to listen for database changes.

---

## 📦 Deployment

The application is deployed on **Vercel**.

Each push to the `main` branch automatically triggers a production deployment.

---

## 🎯 What This Project Demonstrates

- Full-stack development using modern technologies
- Secure OAuth authentication
- Database design with access control
- Real-time data synchronization
- Production-ready deployment workflow

---

## 👨‍💻 Author

Amit Patil  
Information Science Graduate  
Aspiring Full Stack Developer
