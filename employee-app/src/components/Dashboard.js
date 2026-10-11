import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearToken } from './Auth.js';

const MENU = [
    { to: '/', label: 'Absen', end: true },
    { to: '/summary', label: 'Summary Absen' },
    { to: '/profile', label: 'Profil' },
];

function Dashboard() {
    const navigate = useNavigate();
    const signOut = () => {
        clearToken();
        navigate("/login");
    }

    return (
        <div className="app-layout">
            <nav className="app-sidebar bg-dark text-white">
                <span className="app-brand">Absensi WFH</span>
                <ul className="app-menu">
                    {MENU.map(item => (
                        <li key={item.to}>
                            <NavLink to={item.to} end={item.end} className="app-menu-link">
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <button type="button" className="btn btn-outline-light btn-sm app-signout" onClick={signOut}>
                    Sign Out
                </button>
            </nav>
            <main className="app-content">
                <Outlet />
            </main>
        </div>
    )
}

export default Dashboard
