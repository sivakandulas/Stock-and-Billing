const supabase = require('./supabaseClient');

async function testConnection() {
    console.log("Testing Supabase Connection...");
    try {
        const { data, error } = await supabase.from('Categories').select('*').limit(1);
        if (error) {
            console.error("❌ Connection Failed:", error.message);
        } else {
            console.log("✅ Connection Successful! Found categories:", data.length);
        }
    } catch (err) {
        console.error("❌ Unexpected Error:", err.message);
    }
}

testConnection();
