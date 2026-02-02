const express = require('express');
const cors = require('cors');

// const { connectToDB } = require('./db'); // Deprecated

const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);

const { getDashboardStats, getCustomSales } = require('./controllers/dashboardController');
app.get('/api/dashboard/stats', getDashboardStats);
app.post('/api/dashboard/custom-sales', getCustomSales);

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Stock and Billing API is running...');
});

// Connect to DB and Start Server
// Connect to DB and Start Server
// Connect to DB and Start Server

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

module.exports = app;

