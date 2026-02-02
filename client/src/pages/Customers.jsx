import React, { useEffect, useState } from 'react';
import api from '../api';
import CustomerModal from '../components/CustomerModal';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCustomers = () => {
        api.get('/customers')
            .then(res => setCustomers(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2>Customers</h2>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Customer</button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Village</th>
                            <th>Total Due</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(customers) ? customers.map(c => (
                            <tr key={c.CustomerID}>
                                <td>{c.Name}</td>
                                <td>{c.Phone}</td>
                                <td>{c.Address}</td>
                                <td>{c.Village}</td>
                                <td style={{ fontWeight: 'bold', color: c.TotalBalance > 0 ? '#ef4444' : 'inherit' }}>
                                    ₹{(c.TotalBalance || 0).toFixed(2)}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No customers found (or error loading).</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CustomerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchCustomers}
            />
        </div>
    );
};

export default Customers;
