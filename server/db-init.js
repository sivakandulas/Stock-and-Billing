const { connectToDB, sql } = require('./db');

async function createSchema() {
    let pool;
    try {
        pool = await connectToDB();

        console.log("Creating/Verifying schema...");

        // 1. Users Table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' and xtype='U')
            CREATE TABLE Users (
                UserID INT PRIMARY KEY IDENTITY(1,1),
                Username NVARCHAR(50) NOT NULL UNIQUE,
                PasswordHash NVARCHAR(255) NOT NULL,
                Role NVARCHAR(20) DEFAULT 'User', -- 'Admin', 'User'
                CreatedAt DATETIME DEFAULT GETDATE()
            )
        `);
        console.log(" - Users table checked/created.");

        // 2. Customers (Farmers) Table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Customers' and xtype='U')
            CREATE TABLE Customers (
                CustomerID INT PRIMARY KEY IDENTITY(1,1),
                Name NVARCHAR(100) NOT NULL,
                Phone NVARCHAR(20),
                Address NVARCHAR(255),
                Village NVARCHAR(100),
                CreatedAt DATETIME DEFAULT GETDATE()
            )
        `);
        console.log(" - Customers table checked/created.");

        // 3. Categories Table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categories' and xtype='U')
            CREATE TABLE Categories (
                CategoryID INT PRIMARY KEY IDENTITY(1,1),
                Name NVARCHAR(50) NOT NULL UNIQUE 
            )
        `);
        // Seed default categories if empty
        const catCheck = await pool.request().query("SELECT COUNT(*) as count FROM Categories");
        if (catCheck.recordset[0].count === 0) {
            await pool.request().query(`
                INSERT INTO Categories (Name) VALUES ('Fertilizers'), ('Pesticides'), ('Seeds'), ('Bio-Products')
            `);
            console.log("   - Seeded default categories.");
        }
        console.log(" - Categories table checked/created.");

        // 4. Products Table (With Batch & Expiry for Agriculture)
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Products' and xtype='U')
            CREATE TABLE Products (
                ProductID INT PRIMARY KEY IDENTITY(1,1),
                Name NVARCHAR(100) NOT NULL,
                CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID),
                Manufacture NVARCHAR(100),
                HSNCode NVARCHAR(20),
                Unit NVARCHAR(20), -- kg, liter, packet
                Price DECIMAL(10, 2) NOT NULL,
                BatchNo NVARCHAR(50), 
                ExpiryDate DATE,
                StockQuantity INT DEFAULT 0,
                CreatedAt DATETIME DEFAULT GETDATE()
            )
        `);
        console.log(" - Products table checked/created.");

        // 5. Invoices Table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Invoices' and xtype='U')
            CREATE TABLE Invoices (
                InvoiceID INT PRIMARY KEY IDENTITY(1,1),
                CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
                TotalAmount DECIMAL(10, 2) NOT NULL,
                Discount DECIMAL(10, 2) DEFAULT 0,
                FinalAmount DECIMAL(10, 2) NOT NULL,
                PaymentMode NVARCHAR(20) DEFAULT 'Cash',
                InvoiceDate DATETIME DEFAULT GETDATE(),
                CreatedBy INT FOREIGN KEY REFERENCES Users(UserID) -- Optional: who created the bill
            )
        `);
        console.log(" - Invoices table checked/created.");

        // 6. InvoiceItems Table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='InvoiceItems' and xtype='U')
            CREATE TABLE InvoiceItems (
                ItemID INT PRIMARY KEY IDENTITY(1,1),
                InvoiceID INT FOREIGN KEY REFERENCES Invoices(InvoiceID),
                ProductID INT FOREIGN KEY REFERENCES Products(ProductID),
                Quantity INT NOT NULL,
                UnitPrice DECIMAL(10, 2) NOT NULL,
                TotalPrice DECIMAL(10, 2) NOT NULL
            )
        `);
        console.log(" - InvoiceItems table checked/created.");

        console.log("✅ Database Schema Initialized Successfully!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Schema Creation Failed:", err);
        process.exit(1);
    }
}

createSchema();
