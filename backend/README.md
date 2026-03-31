# HRMS Backend - Group Project

This is the fully secured and standardized backend for the Human Resource Management System. It handles Authentication, Role-Based Access Control (RBAC), Attendance tracking, Leave management, Payroll, and Announcements.

## 🚀 Tech Stack
- **Node.js & Express**: Core framework
- **MongoDB & Mongoose**: Database & Schema modeling
- **JWT (JSON Web Token)**: Session-based security
- **Bcrypt.js**: High-security password hashing
- **Axios (Frontend Service)**: Centralized API client included in `frontend/src/services/api.js`

## 🛠️ Getting Started

### 1. Installation
In the `backend` folder, run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` root:
```env
PORT=8001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 3. Run the Server
```bash
npm start
# or for development
npm run dev
```

---

## 🛡️ Security & Role Mapping
The API is protected by **JWT**. Almost all routes require a secure token in the Authorization header: `Bearer <token>`.

| Role | Permissions |
| --- | --- |
| **Admin** | Full access to all modules, including Payroll & Department creation. |
| **HR** | Full access to employee management and leave approvals. |
| **Employee** | Access to check-in/out, applying for leaves, and viewing their own history. |

---

## 📡 Essential API Routes

### Auth
- `POST /api/v1/auth/login` (Standard employee login)
- `POST /api/v1/auth/login/admin` (Admin/HR restricted login)
- `POST /api/v1/auth/register` (Restricted to Admin/HR)

### Attendance
- `POST /api/v1/attendance/check-in` (Auto-identifies via JWT)
- `POST /api/v1/attendance/check-out` (Auto-calculates hours)

### Leaves
- `POST /api/v1/leaves/apply` (Standard apply)
- `GET  /api/v1/leaves/my-leaves` (Self history)
- `GET  /api/v1/leaves` (Admin-only list)
- `PUT  /api/v1/leaves/:id/status` (Approve/Reject)

---

## 🎨 Note for Frontend Teammates
All requests should go through **`frontend/src/services/api.js`**. 
- It automatically handles **Interceptors** to inject the token.
- It automatically **Logout** users if their token expires (401).
- It **Unwraps** the data so you can access `res.data` directly.

**Developed by: Ayush & Gemini Antigravity** 🚀
