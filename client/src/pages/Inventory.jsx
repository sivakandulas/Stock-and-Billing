import React, { useEffect, useState } from 'react';
import api from '../api';
import ProductModal from '../components/ProductModal';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProducts = () => {
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2>Products</h2>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Product</button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.ProductID}>
                                <td>{p.Name}</td>
                                <td>{p.CategoryID}</td>
                                <td>₹{p.Price}</td>
                                <td>{p.StockQuantity}</td>
                                <td>
                                    <button className="btn" style={{ color: 'var(--primary)' }}>Edit</button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No products found.</td></tr>}
                    </tbody>
                </table>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchProducts}
            />
        </div>
    );
};

export default Inventory;
