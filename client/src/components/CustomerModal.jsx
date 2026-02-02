import React, { useState } from 'react';
import api from '../api';

const CustomerModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        Name: '',
        Phone: '',
        Address: '',
        Village: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/customers', formData);
            onSave();
            onClose();
            setFormData({ Name: '', Phone: '', Address: '', Village: '' });
        } catch (err) {
            console.error("Failed to save customer:", err);
            alert("Failed to save customer.");
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '400px' }}>
                <h3 style={{ marginBottom: '1rem' }}>Add New Customer</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <div>
                        <label>Farmer Name</label>
                        <input name="Name" value={formData.Name} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Phone Number</label>
                        <input name="Phone" value={formData.Phone} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Village</label>
                        <input name="Village" value={formData.Village} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Address</label>
                        <input name="Address" value={formData.Address} onChange={handleChange} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="btn" onClick={onClose} style={{ backgroundColor: '#e2e8f0' }}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Customer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerModal;
