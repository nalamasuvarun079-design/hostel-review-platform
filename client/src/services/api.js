import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Interceptor to attach Authorization Bearer token
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('hosteller_user') || 'null');
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getProfile: () => API.get('/auth/profile'),
  toggleSaveHostel: (hostelId) => API.post(`/auth/save-hostel/${hostelId}`),
};

export const hostelAPI = {
  getAll: (params) => API.get('/hostels', { params }),
  getById: (id) => API.get(`/hostels/${id}`),
  create: (data) => API.post('/hostels', data),
  update: (id, data) => API.put(`/hostels/${id}`, data),
  delete: (id) => API.delete(`/hostels/${id}`),
};

export const reviewAPI = {
  getByHostel: (hostelId) => API.get(`/reviews/hostel/${hostelId}`),
  create: (data) => API.post('/reviews', data),
  update: (id, data) => API.put(`/reviews/${id}`, data),
  delete: (id) => API.delete(`/reviews/${id}`),
  toggleLike: (id) => API.post(`/reviews/${id}/like`),
  report: (id, reason) => API.post(`/reviews/${id}/report`, { reason }),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  updateUserRole: (id, role) => API.put(`/admin/users/${id}`, { role }),
  getReports: () => API.get('/admin/reports'),
  handleReport: (id, status) => API.put(`/admin/reports/${id}`, { status }),
};

export const uploadAPI = {
  uploadImage: (formData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default API;
