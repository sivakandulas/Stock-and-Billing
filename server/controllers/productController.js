const supabase = require('../supabaseClient');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Products')
            .select('*')
            .order('Name', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new product
const createProduct = async (req, res) => {
    const { Name, CategoryID, Manufacture, HSNCode, Unit, Price, BatchNo, ExpiryDate, StockQuantity } = req.body;
    try {
        const { error } = await supabase
            .from('Products')
            .insert([{
                Name,
                CategoryID: parseInt(CategoryID) || null,
                Manufacture: Manufacture || null,
                HSNCode: HSNCode || null,
                Unit,
                Price: parseFloat(Price),
                BatchNo: BatchNo || null,
                ExpiryDate: ExpiryDate || null, // Handle empty string for Date
                StockQuantity: parseInt(StockQuantity)
            }]);

        if (error) {
            console.error("Supabase Insert Error:", error);
            throw error;
        }
        res.status(201).json({ message: 'Product added successfully' });
    } catch (err) {
        console.error("Create Product Exception:", err);
        res.status(500).json({ error: err.message, details: err });
    }
};

// Update product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { Name, CategoryID, Manufacture, HSNCode, Unit, Price, BatchNo, ExpiryDate, StockQuantity } = req.body;
    try {
        const { error } = await supabase
            .from('Products')
            .update({
                Name,
                CategoryID,
                Manufacture,
                HSNCode,
                Unit,
                Price,
                BatchNo,
                ExpiryDate,
                StockQuantity
            })
            .eq('ProductID', id); // Ensure Primary Key matches

        if (error) throw error;
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('Products')
            .delete()
            .eq('ProductID', id);

        if (error) throw error;
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct };
