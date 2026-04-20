import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? 'http://127.0.0.1:5000/api' : '/api');

const API = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('portfolio_token');
      if (window.location.pathname.startsWith('/admin/')) {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(err);
  }
);

export const profileAPI = {
  get: () => API.get('/profile'),
  update: (data) => API.put('/profile', data),
};

export const projectsAPI = {
  getAll: () => API.get('/projects'),
  getOne: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post('/projects', data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
};

export const skillsAPI = {
  getAll: () => API.get('/skills'),
  create: (data) => API.post('/skills', data),
  update: (id, data) => API.put(`/skills/${id}`, data),
  delete: (id) => API.delete(`/skills/${id}`),
};

export const experiencesAPI = {
  getAll: () => API.get('/experiences'),
  create: (data) => API.post('/experiences', data),
  update: (id, data) => API.put(`/experiences/${id}`, data),
  delete: (id) => API.delete(`/experiences/${id}`),
};

export const educationAPI = {
  getAll: () => API.get('/education'),
  create: (data) => API.post('/education', data),
  update: (id, data) => API.put(`/education/${id}`, data),
  delete: (id) => API.delete(`/education/${id}`),
};

export const testimonialsAPI = {
  getAll: () => API.get('/testimonials'),
  create: (data) => API.post('/testimonials', data),
  update: (id, data) => API.put(`/testimonials/${id}`, data),
  delete: (id) => API.delete(`/testimonials/${id}`),
};

export const contactAPI = {
  send: (data) => API.post('/contact', data),
  getAll: () => API.get('/contact'),
  updateStatus: (id, status) => API.patch(`/contact/${id}/status`, { status }),
  delete: (id) => API.delete(`/contact/${id}`),
};

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  me: () => API.get('/auth/me'),
};

export const uploadAPI = {
  single: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  multiple: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return API.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default API;
