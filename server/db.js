// This file is deprecated. Use supabaseClient.js instead.
console.warn("WARNING: db.js is deprecated. Use supabaseClient.js instead.");

const supabase = require('./supabaseClient');

module.exports = {
    connectToDB: async () => {
        console.warn("connectToDB is deprecated and does nothing for Supabase.");
        return supabase;
    },
    sql: {
        // Mock SQL types if needed for legacy code temporarily, or error out
        NVarChar: 'NVarChar',
        Int: 'Int',
        Decimal: 'Decimal',
        Date: 'Date',
    }
};
