const supabase = require('./supabaseClient');

async function checkCategories() {
    console.log("Checking Categories...");
    const { data, error } = await supabase.from('Categories').select('*');
    if (error) {
        console.error("Error fetching categories:", error);
    } else {
        console.log("Categories found:", data);
    }
}

checkCategories();
