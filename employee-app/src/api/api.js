import axios from 'axios';
import { clearToken, fetchToken } from '../components/Auth.js';

export const API_URL = process.env.REACT_APP_EMPLOYEE_API_URL || 'http://localhost:3002/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
    const token = fetchToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        // An expired/invalid token sends the user back to login; a failed login just shows its error.
        if (error.response?.status === 401 && !error.config.url.endsWith('/auth/login')) {
            clearToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/** Turns an API error into a readable message (validation errors come as an array). */
export const errorMessage = (error) => {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    return message || 'Something went wrong, please try again.';
};

/** Avatars are stored as /uploads/... paths served by the API host. */
export const assetUrl = (path) => (path && path.startsWith('/') ? new URL(API_URL).origin + path : path);

export default api;
