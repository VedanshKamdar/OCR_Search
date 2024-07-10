import axios from 'axios';

export const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleSessionExpired = () => {
  alert('Session has expired. Please sign in again.');
  window.location.href = '/signin';
};

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      handleSessionExpired();
    }
    return Promise.reject(error);
  }
);
