import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    signup: (data) => API.post('/auth/signup', data),
    login: (data) => API.post('/auth/login', data),
    getProfile: () => API.get('/auth/profile'),
    updateProfile: (data) => API.put('/auth/profile', data),
    forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => API.post(`/auth/reset-password/${token}`, { password }),
};

// Transaction APIs
export const transactionAPI = {
    getAll: (params) => API.get('/transactions', { params }),
    getById: (id) => API.get(`/transactions/${id}`),
    create: (data) => API.post('/transactions', data),
    update: (id, data) => API.put(`/transactions/${id}`, data),
    delete: (id) => API.delete(`/transactions/${id}`),
    getDailySummary: (date) => API.get('/transactions/summary/daily', { params: { date } }),
};

// Category APIs
export const categoryAPI = {
    getAll: () => API.get('/categories'),
    create: (data) => API.post('/categories', data),
    update: (id, data) => API.put(`/categories/${id}`, data),
    delete: (id) => API.delete(`/categories/${id}`),
};

// Receipt APIs
export const receiptAPI = {
    upload: (formData) => API.post('/receipts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getByTransaction: (transactionId) => API.get(`/receipts/transaction/${transactionId}`),
    delete: (id) => API.delete(`/receipts/${id}`),
};

// Dashboard APIs
export const dashboardAPI = {
    getSummary: () => API.get('/dashboard/summary'),
    getTrend: () => API.get('/dashboard/trend'),
    getCategoryDistribution: () => API.get('/dashboard/category-distribution'),
    getMonthlyComparison: () => API.get('/dashboard/monthly-comparison'),
};

// Report APIs
export const reportAPI = {
    getMonthly: (params) => API.get('/reports/monthly', { params }),
    getVendor: (params) => API.get('/reports/vendor', { params }),
    getCategory: (params) => API.get('/reports/category', { params }),
    exportPDF: (params) => API.get('/reports/export/pdf', {
        params,
        responseType: 'blob',
    }),
    exportExcel: (params) => API.get('/reports/export/excel', {
        params,
        responseType: 'blob',
    }),
};

export default API;
