const supabase = require('../supabaseClient');

// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Customers')
            .select('*, Invoices(BalanceAmount)')
            .order('Name', { ascending: true });

        if (error) throw error;

        // Calculate Total Balance for each customer
        const customersWithBalance = data.map(customer => {
            const totalBalance = customer.Invoices
                ? customer.Invoices.reduce((sum, inv) => sum + (inv.BalanceAmount || 0), 0)
                : 0;
            const { Invoices, ...rest } = customer; // Remove raw Invoices array from response
            return { ...rest, TotalBalance: totalBalance };
        });

        res.json(customersWithBalance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new customer
const createCustomer = async (req, res) => {
    const { Name, Phone, Address, Village } = req.body;
    try {
        const { error } = await supabase
            .from('Customers')
            .insert([{ Name, Phone, Address, Village }]);

        if (error) throw error;
        res.status(201).json({ message: 'Customer added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllCustomers, createCustomer };
