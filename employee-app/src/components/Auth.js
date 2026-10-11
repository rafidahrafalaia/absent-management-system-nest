import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const TOKEN_KEY = 'Token';

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const fetchToken = () => localStorage.getItem(TOKEN_KEY);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export function RequireToken({ children }) {
    const location = useLocation();
    if (!fetchToken()) {
        return <Navigate to="/login" state={{ from: location }} />;
    }
    return children;
}
