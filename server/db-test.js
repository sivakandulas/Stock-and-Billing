const { connectToDB } = require('./db');

(async () => {
    try {
        const pool = await connectToDB();
        const result = await pool.request().query('SELECT @@VERSION as version');
        console.log("Database Version:", result.recordset[0].version);
        process.exit(0);
    } catch (err) {
        console.error("Test Failed:", err);
        process.exit(1);
    }
})();
