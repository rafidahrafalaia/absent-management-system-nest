import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearToken } from './Auth.js';
import Notification from './Notification.js';

const MENU = [
    { to: '/', label: 'Data Karyawan', end: true },
    { to: '/create', label: 'Tambah Karyawan' },
    { to: '/absents', label: 'Absensi Karyawan' },
];

function Dashboard() {
    const navigate = useNavigate();
    const signOut = () => {
        clearToken();
        navigate("/login");
    }

    return (
        <div className="app-layout">
            <Notification />
            <nav className="app-sidebar bg-dark text-white">
                <span className="app-brand">Employee Monitoring</span>
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
