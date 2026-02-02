import React, { useEffect, useState } from 'react';
import api from '../api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        lowStockItems: 0,
        salesToday: 0,
        salesWeek: 0,
        salesMonth: 0
    });

    const [customRange, setCustomRange] = useState({ start: '', end: '' });
    const [customTotal, setCustomTotal] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            }
        };

        fetchStats();
    }, []);

    const handleCustomSales = async () => {
        if (!customRange.start || !customRange.end) {
            alert("Please select both start and end dates");
            return;
        }
        try {
            const res = await api.post('/dashboard/custom-sales', {
                startDate: customRange.start,
                endDate: customRange.end
            });
            setCustomTotal(res.data.total);
        } catch (err) {
            console.error("Failed to fetch custom sales", err);
        }
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3>Total Sales</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>₹{(stats?.totalSales || 0).toFixed(2)}</p>
                </div>
                <div className="card">
                    <h3>Today's Sales</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>₹{(stats?.salesToday || 0).toFixed(2)}</p>
                </div>
                <div className="card">
                    <h3>Last 7 Days</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>₹{(stats?.salesWeek || 0).toFixed(2)}</p>
                </div>
                <div className="card">
                    <h3>Last 30 Days</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>₹{(stats?.salesMonth || 0).toFixed(2)}</p>
                </div>
                <div className="card">
                    <h3>Total Orders</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalOrders}</p>
                </div>
                <div className="card">
                    <h3>Low Stock Items</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: stats.lowStockItems > 0 ? '#ef4444' : 'inherit' }}>
                        {stats.lowStockItems}
                    </p>
                </div>
            </div>

            {/* Custom Range Calculator */}
            <div className="card" style={{ maxWidth: '600px' }}>
                <h3>Custom Date Range Sales</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginTop: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Start Date</label>
                        <input
                            type="date"
                            value={customRange.start}
                            onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                            style={{ padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>End Date</label>
                        <input
                            type="date"
                            value={customRange.end}
                            onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                            style={{ padding: '0.5rem' }}
                        />
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleCustomSales}
                        style={{ height: '38px' }}
                    >
                        Check Sales
                    </button>
                </div>
                {customTotal !== null && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
                        <h4 style={{ margin: 0, color: '#0369a1' }}>Total for Period: ₹{customTotal.toFixed(2)}</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
