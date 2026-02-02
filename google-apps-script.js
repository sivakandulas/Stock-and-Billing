// Google Apps Script for Stock and Billing App

const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
    return handleRequest(e);
}

function doPost(e) {
    return handleRequest(e);
}

function handleRequest(e) {
    const params = e.parameter;
    const action = params.action;

    let result = {};

    try {
        if (action === 'getProducts') {
            result = getData('Products');
        } else if (action === 'getCustomers') {
            result = getData('Customers');
        } else if (action === 'addProduct') {
            const data = JSON.parse(e.postData.contents);
            result = addRow('Products', [
                data.Name,
                data.Category || 'General',
                data.Price,
                data.StockQuantity,
                data.Unit,
                data.BatchNo,
                data.ExpiryDate
            ]);
        } else if (action === 'addCustomer') {
            const data = JSON.parse(e.postData.contents);
            result = addRow('Customers', [
                data.Name,
                data.Phone,
                data.Address,
                data.Village
            ]);
        } else if (action === 'createInvoice') {
            const data = JSON.parse(e.postData.contents);
            // data.Items is array of cart items
            // 1. Save Invoice
            const invoiceId = new Date().getTime(); // Simple ID
            const itemsJson = JSON.stringify(data.Items);

            addRow('Invoices', [
                invoiceId,
                data.CustomerID,
                data.FinalAmount,
                new Date().toISOString(),
                itemsJson
            ]);

            // 2. Deduct Stock
            updateStock(data.Items);

            result = { status: 'success', invoiceId: invoiceId };
        }
    } catch (error) {
        result = { status: 'error', message: error.toString() };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
}

function getData(sheetName) {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName);
    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
        let obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index];
        });
        // Add mapped IDs for frontend compatibility
        if (sheetName === 'Products') obj.ProductID = obj.ProductID || row[0];
        // The above is tricky if ID is not auto-generated. 
        // Let's assume row index acting as ID if empty or similar. 
        // Ideally we generate IDs. 

        // Compatibility mapping
        if (sheetName === 'Products') {
            obj.StockQuantity = obj.Stock;
            obj.CategoryID = obj.Category;
        }
        return obj;
    });
    return data;
}

function addRow(sheetName, rowData) {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName);
    // Generate an ID for the first column if needed
    const id = new Date().getTime().toString();
    sheet.appendRow([id, ...rowData]);
    return { status: 'success', id: id };
}

function updateStock(items) {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Products');
    const data = sheet.getDataRange().getValues();
    // Map Product Name or ID to Row Index. 
    // Assuming ProductID is unique in Col 0.

    items.forEach(item => {
        for (let i = 1; i < data.length; i++) {
            // Check by Name since our ID system is weak in Sheets right now
            if (data[i][1] == item.Name) {
                const currentStock = data[i][4]; // Column 5 is Stock
                const newStock = currentStock - item.Quantity;
                sheet.getRange(i + 1, 5).setValue(newStock);
                break;
            }
        }
    });
}
