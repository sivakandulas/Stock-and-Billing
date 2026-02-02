import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const navItems = [
        { label: 'Dashboard', path: '/' },
        { label: 'Inventory', path: '/inventory' },
        { label: 'Customers', path: '/customers' },
        { label: 'Billing', path: '/billing' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
            {/* Sidebar */}
            <aside style={{
                width: isSidebarOpen ? '240px' : '0',
                backgroundColor: '#1e293b',
                color: 'white',
                padding: isSidebarOpen ? '1.5rem' : '0',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    opacity: isSidebarOpen ? 1 : 0,
                    transition: 'opacity 0.2s'
                }}>
                    <h2 style={{ color: '#60a5fa', margin: 0 }}>Stock Manager</h2>
                    {/* Close button inside sidebar for mobile if needed, or just rely on toggle */}
                </div>

                <nav style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    opacity: isSidebarOpen ? 1 : 0,
                    transition: 'opacity 0.2s'
                }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                textDecoration: 'none',
                                color: location.pathname === item.path ? 'white' : '#94a3b8',
                                backgroundColor: location.pathname === item.path ? '#334155' : 'transparent',
                                fontWeight: location.pathname === item.path ? '600' : '400',
                                transition: 'all 0.2s',
                                display: 'block'
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', position: 'relative' }}>
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Toggle Button */}
                        <button
                            onClick={toggleSidebar}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.5rem',
                                padding: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '0.25rem'
                            }}
                            title="Toggle Sidebar"
                        >
                            ☰
                        </button>
                        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                            {navItems.find(i => i.path === location.pathname)?.label || 'App'}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span>Welcome, Admin</span>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
};

export default Layout;
