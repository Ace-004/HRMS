import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// 🛡️ REQUEST INTERCEPTOR: Inject JWT Token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// 🏗️ RESPONSE INTERCEPTOR: Global Error Handling & Data Unwrapping
API.interceptors.response.use(
  (response) => {
    // Return only the inner data object (standardized success/data structure)
    return response.data;
  },
  (error) => {
    // Handle Token Expiration (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- API ENDPOINTS ---

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Departments
export const getDepartments = () => API.get('/departments');
export const createDepartment = (data) => API.post('/departments/create', data);

// Employees
export const getEmployees = () => API.get('/employees');
export const getEmployeeProfile = (id) => API.get(`/employees/${id}`);
export const createEmployeeProfile = (data) => API.post('/employees/create', data);

// Attendance
export const checkIn = () => API.post('/attendance/check-in');
export const checkOut = () => API.post('/attendance/check-out');

// Leaves
export const applyLeave = (data) => API.post('/leaves/apply', data);
export const getMyLeaves = () => API.get('/leaves/my-leaves');
export const getAllLeaves = () => API.get('/leaves');
export const updateLeaveStatus = (id, status) => API.put(`/leaves/${id}/status`, { status });

// Payroll
export const getPayrollRecords = () => API.get('/payroll');
export const createPayroll = (data) => API.post('/payroll/create', data);

// Announcements
export const getAnnouncements = () => API.get('/announcements');
export const postAnnouncement = (data) => API.post('/announcements/create', data);

export default API;
