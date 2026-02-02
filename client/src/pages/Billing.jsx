import React, { useEffect, useState } from 'react';
import api from '../api';

const Billing = () => {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        // Fetch Customers and Products
        const fetchData = async () => {
            try {
                const [custRes, prodRes] = await Promise.all([
                    api.get('/customers'),
                    api.get('/products')
                ]);
                setCustomers(custRes.data);
                setProducts(prodRes.data);
            } catch (err) {
                console.error("Failed to load data", err);
            }
        };
        fetchData();
    }, []);

    // Filter products based on search
    const filteredProducts = products.filter(p =>
        p.Name.toLowerCase().includes(productSearch.toLowerCase()) && p.StockQuantity > 0
    );

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.ProductID === product.ProductID);
            if (existing) {
                return prev.map(item =>
                    item.ProductID === product.ProductID
                        ? { ...item, Quantity: item.Quantity + 1, TotalPrice: (item.Quantity + 1) * item.UnitPrice }
                        : item
                );
            } else {
                return [...prev, {
                    ProductID: product.ProductID,
                    Name: product.Name,
                    Quantity: 1,
                    UnitPrice: product.Price,
                    TotalPrice: product.Price
                }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.ProductID !== productId));
    };

    const updateQuantity = (productId, newQty) => {
        if (newQty < 1) return;
        setCart(prev => prev.map(item =>
            item.ProductID === productId
                ? { ...item, Quantity: newQty, TotalPrice: newQty * item.UnitPrice }
                : item
        ));
    };

    const calculateTotal = () => {
        const total = cart.reduce((sum, item) => sum + item.TotalPrice, 0);
        return total;
    };

    const handleCreateInvoice = async () => {
        if (!selectedCustomer) {
            alert("Please select a customer!");
            return;
        }
        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }

        const totalAmount = calculateTotal();
        const payload = {
            CustomerID: selectedCustomer,
            Items: cart,
            TotalAmount: totalAmount,
            Discount: parseFloat(discount) || 0,
            FinalAmount: totalAmount - (parseFloat(discount) || 0),
            PaymentMode: 'Cash', // Could be dynamic
            CreatedBy: 1 // Default Admin for now
        };

        try {
            const res = await api.post('/invoices', payload);
            alert(`Invoice Created Successfully! ID: ${res.data.invoiceId}`);
            setCart([]);
            setSelectedCustomer('');
            setDiscount(0);
            // Optionally refresh products to update stock
            const prodRes = await api.get('/products');
            setProducts(prodRes.data);
        } catch (err) {
            console.error(err);
            alert("Failed to create invoice.");
        }
    };

    return (
        <div className="billing-grid">

            {/* Left Panel: Product Selection */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '1rem' }}>Select Products</h3>
                <input
                    type="text"
                    placeholder="Search Products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                />

                <div style={{ overflowY: 'auto', flex: 1 }}>
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => (
                                <tr key={p.ProductID}>
                                    <td>{p.Name}</td>
                                    <td>₹{p.Price}</td>
                                    <td>{p.StockQuantity}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                            onClick={() => addToCart(p)}
                                        >
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right Panel: Cart & Billing */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '1rem' }}>New Invoice</h3>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Customer</label>
                    <select
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                    >
                        <option value="">-- Select Customer --</option>
                        {customers.map(c => (
                            <option key={c.CustomerID} value={c.CustomerID}>{c.Name} ({c.Phone})</option>
                        ))}
                    </select>
                </div>

                <div className="table-container" style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item.ProductID}>
                                    <td>{item.Name}</td>
                                    <td style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <button onClick={() => updateQuantity(item.ProductID, item.Quantity - 1)}>-</button>
                                        <span>{item.Quantity}</span>
                                        <button onClick={() => updateQuantity(item.ProductID, item.Quantity + 1)}>+</button>
                                    </td>
                                    <td>₹{item.TotalPrice.toFixed(2)}</td>
                                    <td>
                                        <button
                                            onClick={() => removeFromCart(item.ProductID)}
                                            style={{ color: 'red', background: 'none', border: 'none' }}
                                        >
                                            x
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {cart.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>Cart is empty</td></tr>}
                        </tbody>
                    </table>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Subtotal:</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <span>Discount:</span>
                        <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            style={{ width: '100px', padding: '0.25rem' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>
                        <span>Total:</span>
                        <span>₹{(calculateTotal() - (parseFloat(discount) || 0)).toFixed(2)}</span>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={handleCreateInvoice}
                    >
                        Generate Invoice
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Billing;
