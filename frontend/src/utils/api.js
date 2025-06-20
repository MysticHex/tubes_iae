import axios from 'axios';
import { getToken } from './auth';

// Base URL dari env
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4001';

// Axios instance dengan konfigurasi
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  validateToken: () => api.get('/auth/validate')
};

export const bukuService = {
  getAll: () => api.get('/buku'),
  getById: (id) => api.get(`/buku/${id}`),
  create: (data) => api.post('/buku', data),
  update: (id, data) => api.put(`/buku/${id}`, data),
  delete: (id) => api.delete(`/buku/${id}`)
};

export const mahasiswaService = {
  getAll: () => api.get('/mahasiswa'),
  getById: (id) => api.get(`/mahasiswa/${id}`),
  create: (data) => api.post('/mahasiswa', data),
  update: (id, data) => api.put(`/mahasiswa/${id}`, data),
  delete: (id) => api.delete(`/mahasiswa/${id}`)
};

export const peminjamanService = {
  getAll: () => api.get('/peminjaman'),
  getById: (id) => api.get(`/peminjaman/${id}`),
  create: (data) => api.post('/peminjaman', data),
  update: (id, data) => api.put(`/peminjaman/${id}`, data),
  delete: (id) => api.delete(`/peminjaman/${id}`)
};

export default api;
