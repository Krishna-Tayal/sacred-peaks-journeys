# Sacred Peaks Journeys (Trip Tonick) 🏔️

A full-stack travel agency and booking management platform built with the MERN stack (MongoDB, Express.js, React, Node.js) and TypeScript. 

This platform allows users to explore travel destinations, view curated tour packages, and submit booking requests. It also features a dedicated, secure Admin panel to manage bookings, upload gallery images, and handle platform content.

## ✨ Features

### User Facing (Frontend)
* **Explore Destinations:** Browse detailed information about various travel destinations (e.g., Kedarnath, Badrinath).
* **Tour Packages:** View available travel packages with itineraries, pricing, and inclusions.
* **Booking System:** Seamless booking request form for users to express interest in specific packages.
* **Photo Gallery:** Interactive image gallery showcasing travel experiences.
* **Responsive Design:** Fully mobile-responsive interface built with Tailwind CSS.

### Admin Dashboard (Admin)
* **Secure Authentication:** JWT-based login restricted to administrative staff.
* **Booking Management:** View, approve, or mark booking requests as completed.
* **Content Management:** Add, edit, or delete destinations and travel packages.
* **Gallery Management:** Upload and manage images via Cloudinary integration.

## 🛠️ Tech Stack

**Frontend & Admin Panel:**
* React 18
* TypeScript
* Vite (Build Tool)
* Tailwind CSS (Styling)
* React Router DOM (Routing)
* React Query / TanStack Query (Data fetching & caching)
* Shadcn UI (Component library)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Database & ORM)
* JSON Web Tokens (JWT Authentication)
* Cloudinary (Image Storage)
* Multer (File Upload Handling)

## 📁 Project Structure

The project is structured as a monorepo containing three main directories:

```text
sacred-peaks-journeys/
├── backend/       # Node.js/Express REST API
├── frontend/      # User-facing React application
└── admin/         # Admin dashboard React application
