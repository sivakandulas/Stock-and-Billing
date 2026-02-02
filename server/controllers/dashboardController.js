const supabase = require('../supabaseClient');

const getDashboardStats = async (req, res) => {
    try {
        // Fetch all invoices with FinalAmount and InvoiceDate
        const { data: invoices, error: invError } = await supabase
            .from('Invoices')
            .select('FinalAmount, InvoiceDate');

        if (invError) throw invError;

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const startOfWeek = new Date(now.setDate(now.getDate() - 7)).toISOString();
        const startOfMonth = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(); // Approx 30 days

        let totalSales = 0;
        let salesToday = 0;
        let salesWeek = 0;
        let salesMonth = 0;

        invoices.forEach(inv => {
            const amount = inv.FinalAmount || 0;
            const date = new Date(inv.InvoiceDate).toISOString();

            totalSales += amount;

            if (date >= startOfDay) salesToday += amount;
            if (date >= startOfWeek) salesWeek += amount;
            if (date >= startOfMonth) salesMonth += amount;
        });

        const totalOrders = invoices.length;

        // Low Stock Items (e.g., less than 10)
        const { count: lowStockCount, error: stockError } = await supabase
            .from('Products')
            .select('*', { count: 'exact', head: true })
            .lt('StockQuantity', 10);

        if (stockError) throw stockError;

        res.json({
            totalSales,
            totalOrders,
            lowStockItems: lowStockCount || 0,
            salesToday,
            salesWeek,
            salesMonth
        });

    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ error: err.message });
    }
};

const getCustomSales = async (req, res) => {
    const { startDate, endDate } = req.body;
    try {
        const { data: invoices, error } = await supabase
            .from('Invoices')
            .select('FinalAmount')
            .gte('InvoiceDate', startDate)
            .lte('InvoiceDate', endDate);

        if (error) throw error;

        const total = invoices.reduce((sum, inv) => sum + (inv.FinalAmount || 0), 0);
        res.json({ total });
    } catch (err) {
        console.error("Custom Sales Error:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getDashboardStats, getCustomSales };
