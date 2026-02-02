import React, { useState } from 'react';
import api from '../api';

const ProductModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        Name: '',
        CategoryID: 1, // Default to first category
        Manufacture: '',
        HSNCode: '',
        Unit: 'kg',
        Price: '',
        BatchNo: '',
        ExpiryDate: '',
        StockQuantity: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', formData);
            onSave();
            onClose();
            // Reset form
            setFormData({
                Name: '', CategoryID: 1, Manufacture: '', HSNCode: '',
                Unit: 'kg', Price: '', BatchNo: '', ExpiryDate: '', StockQuantity: ''
            });
        } catch (err) {
            console.error("Failed to save product:", err);
            alert("Failed to save product. Please try again.");
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3 style={{ marginBottom: '1rem' }}>Add New Product</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <div>
                        <label>Product Name</label>
                        <input name="Name" value={formData.Name} onChange={handleChange} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Category ID</label>
                            <input type="number" name="CategoryID" value={formData.CategoryID} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Manufacturer</label>
                            <input name="Manufacture" value={formData.Manufacture} onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Price (₹)</label>
                            <input type="number" step="0.01" name="Price" value={formData.Price} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Stock Quantity</label>
                            <input type="number" name="StockQuantity" value={formData.StockQuantity} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Unit</label>
                            <select name="Unit" value={formData.Unit} onChange={handleChange}>
                                <option value="kg">kg</option>
                                <option value="liter">liter</option>
                                <option value="packet">packet</option>
                                <option value="bag">bag</option>
                            </select>
                        </div>
                        <div>
                            <label>HSN Code</label>
                            <input name="HSNCode" value={formData.HSNCode} onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Batch No</label>
                            <input name="BatchNo" value={formData.BatchNo} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Expiry Date</label>
                            <input type="date" name="ExpiryDate" value={formData.ExpiryDate} onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="btn" onClick={onClose} style={{ backgroundColor: '#e2e8f0' }}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
