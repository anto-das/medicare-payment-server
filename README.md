# MediCare Server API 🏥

This is the backend API for the MediCare project. It manages users, medical records, booking setups, and authentications. It uses Express.js, PostgreSQL, Prisma ORM, and Better Auth.

## 🚀 Features

*   **Fast Database Access**: Powered by **PostgreSQL** and **Prisma ORM**.
*   **Secure Authentication**: Managed by **Better Auth** with cross-origin safety.
*   **Email Verification**: Secure signup workflow with user validation.
*   **Cookie Security**: Parsed cookie validation using **cookie-parser**.
*   **CORS Enabled**: Safe resource sharing between frontend and backend.

---

## 🛠️ Tech Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Auth**: Better Auth
*   **Tools**: dotenv, cors, cookie-parser

---

## 📋 Prerequisites

Make sure you have these items installed on your local computer:

*   Node.js (v18 or higher)
*   PostgreSQL Database instance

---

## ⚙️ Local Setup Guide

Follow these steps to run the server locally.

### 1. Clone the Project
```bash
git clone https://github.com/anto-das/medi-store-server
cd medicare-server
```

### 2. Install Project Tools
```bash
npm install https://github.com/anto-das/medi-store-server
```

### 3. Setup Environment Variables
Create a file named `.env` in the root folder. Copy the keys below into that file:

```env
# Server Network Settings
PORT=5000
CLIENT_URL=http://localhost:3000

# Database Settings
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Better Auth Configuration Keys
BETTER_AUTH_SECRET=your_super_secret_key_here
BETTER_AUTH_URL=http://localhost:5000

# Email Service Provider Keys
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_smtp_username
EMAIL_PASS=your_smtp_password
```

### 4. Database Setup & Sync
Run these database commands to sync your data structures:

```bash
# Generate the client files
npx prisma generate

# Create and run local updates
npx prisma migrate dev --name init
```

### 5. Start the Application Server
```bash
# Run server in development mode
npm run dev

# Start server in production mode
npm start
```

---

## 🛣️ Core Endpoint Routes


| Method | Route Route Path | What it Does |
| :--- | :--- | :--- |
| `POST` | `/api/auth/sign-in/email` | Creates a new user profile |
| `POST` | `/api/auth/sign-up/email` | Starts a secure user session |
| `GET` | `/api/auth/verify-email` | Finishes email verification steps |
| `GET` | `/api/own/profile` | Shows the active user profile data |

---


