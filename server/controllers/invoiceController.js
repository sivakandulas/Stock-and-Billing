const supabase = require('../supabaseClient');

// Get all invoices
const getAllInvoices = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Invoices')
            .select('*, Customers(Name)')
            .order('InvoiceDate', { ascending: false });

        if (error) throw error;

        // Flatten the structure to match original API
        const formattedData = data.map(invoice => ({
            ...invoice,
            CustomerName: invoice.Customers?.Name
        }));

        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new invoice
const createInvoice = async (req, res) => {
    const { CustomerID, Items, TotalAmount, Discount, FinalAmount, PaidAmount, PaymentMode, CreatedBy } = req.body;

    // Calculate Balance
    const balance = FinalAmount - (PaidAmount || 0);

    try {
        // 1. Insert Invoice
        const { data: invoiceData, error: invoiceError } = await supabase
            .from('Invoices')
            .insert([{
                CustomerID,
                TotalAmount,
                Discount,
                FinalAmount,
                PaidAmount: PaidAmount || 0,
                BalanceAmount: balance,
                PaymentMode,
                CreatedBy
            }])
            .select()
            .single();

        if (invoiceError) throw invoiceError;

        const invoiceId = invoiceData.InvoiceID;

        // 2. Process Items (Update Stock & Insert InvoiceItem)
        // Note: Doing this client-side is not fully atomic. 
        // ideally use a Supabase RPC function for atomic transactions.

        for (const item of Items) {
            // Get current stock
            const { data: product, error: fetchError } = await supabase
                .from('Products')
                .select('StockQuantity')
                .eq('ProductID', item.ProductID)
                .single();

            if (fetchError) {
                console.error(`Error fetching product ${item.ProductID}:`, fetchError);
                continue; // specific item error
            }

            const newStock = (product.StockQuantity || 0) - item.Quantity;

            // Update Stock
            const { error: updateError } = await supabase
                .from('Products')
                .update({ StockQuantity: newStock })
                .eq('ProductID', item.ProductID);

            if (updateError) {
                console.error(`Error updating stock for product ${item.ProductID}:`, updateError);
            }

            // Insert Invoice Item
            const { error: itemError } = await supabase
                .from('InvoiceItems')
                .insert([{
                    InvoiceID: invoiceId,
                    ProductID: item.ProductID,
                    Quantity: item.Quantity,
                    UnitPrice: item.UnitPrice,
                    TotalPrice: item.TotalPrice
                }]);

            if (itemError) {
                console.error(`Error inserting invoice item for product ${item.ProductID}:`, itemError);
            }
        }

        res.status(201).json({ message: 'Invoice created successfully', invoiceId });

    } catch (err) {
        console.error("Invoice Creation Error:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllInvoices, createInvoice };
