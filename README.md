# Room Connect System

An online platform for finding and booking PG (Paying Guest) accommodations. Built as a full stack web application for MCA final year project.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Future Scope](#future-scope)

---

## About the Project

Room Connect System is a centralized digital platform that simplifies the process of finding and booking PG accommodations. Tenants can search PGs by city or pincode, view details and images, and send booking requests. PG owners can list their properties and manage bookings. A physical verification step ensures trust between tenants and owners before any booking is confirmed.

---

## Features

### Tenant
- Register and login securely
- Search PGs by city, pincode and room type
- View PG details, images, ratings and reviews
- Send booking requests
- Track booking status (pending, verified, approved, rejected, cancelled)
- Ask questions on PG listings
- Submit feedback and ratings after an approved booking
- Cancel bookings

### PG Owner
- Register and login (requires admin approval)
- Create, edit and delete PG listings
- Upload multiple images per listing
- View and manage booking requests
- Physically verify tenants before approving bookings
- Approve, reject or cancel bookings
- Answer tenant questions (FAQs)
- View reviews on their PGs

### Admin
- Login with seeded credentials
- Approve or reject PG owner registrations
- View and manage all PG listings
- View all tenants
- View all bookings across the platform
- Cancel any booking
- Remove fake or inappropriate listings

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MySQL | Relational database |
| mysql2 | MySQL driver with promise support |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| multer | Image file uploads |
| dotenv | Environment variables |
| cors | Cross-origin resource sharing |
| uuid | Unique ID generation |

### Frontend
| Technology | Purpose |
|---|---|
| React (Vite) | UI library |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Tailwind CSS | Styling |
| React Hot Toast | Notifications |

---

## Project Structure

### Backend
```
room-connect-backend/
├── config/
│   └── db.js                  # MySQL connection pool
├── controllers/
│   ├── authController.js
│   ├── pgController.js
│   ├── bookingController.js
│   ├── feedbackController.js
│   ├── faqController.js
│   └── adminController.js
├── middleware/
│   ├── authMiddleware.js       # JWT verify + role guard
│   ├── uploadMiddleware.js     # Multer image upload
│   └── errorMiddleware.js      # Global error handler
├── models/
│   ├── authModel.js
│   ├── pgModel.js
│   ├── bookingModel.js
│   ├── feedbackModel.js
│   ├── faqModel.js
│   └── adminModel.js
├── routes/
│   ├── authRoutes.js
│   ├── pgRoutes.js
│   ├── bookingRoutes.js
│   ├── feedbackRoutes.js
│   ├── faqRoutes.js
│   └── adminRoutes.js
├── uploads/
│   └── pg_images/             # Uploaded PG images stored here
├── .env
├── .env.example
└── server.js
```

### Frontend
```
room-connect-frontend/
├── src/
│   ├── api/
│   │   └── axios.js           # Axios instance with JWT interceptor
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PGCard.jsx
│   │   ├── BookingCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx    # Global auth state
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── SearchResults.jsx
│   │   ├── PGDetails.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── tenant/
│   │   │   ├── TenantDashboard.jsx
│   │   │   └── MyBookings.jsx
│   │   ├── owner/
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── MyListings.jsx
│   │   │   ├── AddPG.jsx
│   │   │   ├── EditPG.jsx
│   │   │   ├── ManageBookings.jsx
│   │   │   └── ManageFAQs.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── ManageOwners.jsx
│   │       ├── ManageTenants.jsx
│   │       ├── ManagePGs.jsx
│   │       └── ManageBookings.jsx
│   ├── App.jsx
│   └── main.jsx
└── .env
```

---

## Database Schema

Database name: `RcsDB`

| Table | Description |
|---|---|
| Admin | Admin user accounts |
| PG_owner | PG owner accounts |
| Tenant | Tenant accounts |
| PG_room | PG listings |
| Room_images | Images linked to PG listings |
| Booking | Booking requests and statuses |
| Feedback | Tenant reviews and ratings |
| FAQs | Questions and answers on PG listings |

---

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register as tenant or owner |
| POST | `/login` | Public | Login for all roles |
| GET | `/me` | Auth | Get logged in user profile |

### PG Listings — `/api/pg`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Owner | Create PG listing |
| GET | `/search` | Public | Search PGs by city / pincode |
| GET | `/:pg_id` | Public | Get single PG details |
| GET | `/owner/my-listings` | Owner | Get owner's listings |
| PUT | `/:pg_id` | Owner | Update PG listing |
| DELETE | `/:pg_id` | Owner | Delete PG listing |
| POST | `/:pg_id/images` | Owner | Upload PG images |
| DELETE | `/:pg_id/images/:image_id` | Owner | Delete a PG image |

### Bookings — `/api/bookings`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Tenant | Send booking request |
| GET | `/my` | Tenant | Get my bookings |
| GET | `/pg/:pg_id` | Owner | Get bookings for a PG |
| GET | `/:booking_id` | Auth | Get single booking |
| PUT | `/:booking_id/verify` | Owner | Mark tenant as verified |
| PUT | `/:booking_id/status` | Owner | Approve or reject booking |
| PUT | `/:booking_id/cancel` | All | Cancel a booking |

### Feedback — `/api/feedback`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Tenant | Submit feedback and rating |
| GET | `/pg/:pg_id` | Public | Get all feedback for a PG |
| DELETE | `/:feed_id` | Admin | Remove feedback |

### FAQs — `/api/faqs`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Tenant | Ask a question |
| GET | `/pg/:pg_id` | Public | Get all FAQs for a PG |
| PUT | `/:ques_id/answer` | Owner | Answer a question |

### Admin — `/api/admin`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/owners` | Admin | List all owners |
| PUT | `/owners/:owner_id/status` | Admin | Approve or reject owner |
| GET | `/tenants` | Admin | List all tenants |
| GET | `/pg` | Admin | List all PG listings |
| PUT | `/pg/:pg_id/status` | Admin | Update PG availability |
| DELETE | `/pg/:pg_id` | Admin | Remove PG listing |
| GET | `/bookings` | Admin | View all bookings |

---

## Getting Started

### Prerequisites

Make sure you have these installed:
- Node.js v18 or above
- MySQL 8.0 or above
- npm
- Git

---

### Backend Setup

**1. Clone the repository and navigate to backend**
```bash
git clone https://github.com/your-username/room-connect.git
cd room-connect-backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create your `.env` file**
```bash
cp .env.example .env
```
Fill in your MySQL credentials in `.env` (see Environment Variables section below).

**4. Set up the database**

Open MySQL Workbench or terminal and run the SQL schema file:
```bash
mysql -u root -p < RcsDB_schema.sql
```

**5. Seed the admin account**
```bash
node seed.js
```
This creates the default admin account. Delete `seed.js` after running it.

**6. Start the backend server**
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

### Frontend Setup

**1. Navigate to frontend folder**
```bash
cd room-connect-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create your `.env` file**
```env
VITE_API_URL=http://localhost:5000/api
```

**4. Start the frontend**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Environment Variables

### Backend `.env`
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=RcsDB
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
UPLOAD_PATH=uploads/pg_images
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## User Roles

| Role | How to create | Default redirect after login |
|---|---|---|
| Tenant | Register from `/register` | `/dashboard` |
| Owner | Register from `/register` — needs admin approval | `/owner-dashboard` |
| Admin | Created via `seed.js` only | `/admin` |

### Default Admin Credentials
```
Email:    admin@roomconnect.com
Password: admin123
```
> Change these credentials after first login in production.

---

## Booking Flow

```
1. Tenant sends booking request
        ↓
2. Owner sees request in Manage Bookings
        ↓
3. Tenant visits PG physically
        ↓
4. Owner marks tenant as Verified
        ↓
5. Owner approves the booking
        ↓
6. PG is automatically marked as Unavailable
        ↓
7. Tenant can submit feedback after approval
```

> A booking cannot be approved unless the tenant is physically verified first.
> Cancelling an approved booking automatically makes the PG available again.

---

## Future Scope

- Online payment integration for booking fees and deposits
- GPS-based map to view PGs on live maps
- AI-based PG recommendation system
- Real-time chat between tenants and owners
- Document upload for identity verification
- Automated vacancy alerts via email or SMS
- Mobile application for Android and iOS
- Multi-language support

---

## Bibliography

### Books
- IGNOU MCS-213 — Software Engineering
- IGNOU MCS-220 — Web Technologies
- IGNOU MCS-023 — Introduction to Database Management System

### Websites
- https://www.w3schools.com
- https://www.geeksforgeeks.org
- https://www.tutorialspoint.com
- https://docs.npmjs.com
- https://react.dev
- https://expressjs.com

---

## Author

Developed as MCA Final Year Project — 2025