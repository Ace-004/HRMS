import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// Request Interceptor: Inject JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response Interceptor: Unwrap data & handle 401
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginEmployee = (data) => API.post('/auth/login', data);
export const loginAdmin = (data) => API.post('/auth/login/admin', data);
export const loginHr = (data) => API.post('/auth/login/hr', data);
export const registerUser = (data) => API.post('/auth/register', data);

// Departments (admin only)
export const getDepartments = () => API.get('/departments');
export const getDepartmentById = (id) => API.get(`/departments/${id}`);
export const createDepartment = (data) => API.post('/departments/create', data);
export const deleteDepartment = (id) => API.delete(`/departments/${id}`);

// Employees
export const getEmployees = () => API.get('/employees');
export const getMyProfile = () => API.get('/employees/profile');
export const getEmployeeById = (id) => API.get(`/employees/${id}`);
export const createEmployeeProfile = (data) => API.post('/employees/create', data);
export const updateEmployeeProfile = (data) => API.put('/employees/profile', data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);

// Attendance (all roles)
export const checkIn = () => API.post('/attendance/check-in');
export const checkOut = () => API.post('/attendance/check-out');
export const getEmployeeAttendance = (id) => API.get(`/attendance/employee/${id}`);

// Leaves
export const applyLeave = (data) => API.post('/leaves/apply', data);
export const getMyLeaves = () => API.get('/leaves/my-leaves');
export const getAllLeaves = () => API.get('/leaves');
export const getEmployeeLeaves = (id) => API.get(`/leaves/employee/${id}`);
export const updateLeaveStatus = (id, status) => API.put(`/leaves/${id}/status`, { status });

// Payroll
export const getMyPayroll = () => API.get('/payroll/my');
export const getEmployeePayroll = (id) => API.get(`/payroll/employee/${id}`);
export const createPayroll = (data) => API.post('/payroll/create', data);

// Announcements
export const getAnnouncements = () => API.get('/announcements');
export const postAnnouncement = (data) => API.post('/announcements/create', data);
export const deleteAnnouncement = (id) => API.delete(`/announcements/${id}`);

export default API;
