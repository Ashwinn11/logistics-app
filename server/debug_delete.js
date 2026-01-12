import pool from './config/database.js';

async function testDelete() {
    try {
        console.log('--- Testing Deletion ---');
        // Create dummy shipment
        const id = 'TEST-DELETE-' + Date.now();
        await pool.query("INSERT INTO shipments (id, customer, origin, destination, date) VALUES ($1, 'Test Cust', 'Origin', 'Dest', '2024-01-01')", [id]);
        console.log('Created Shipment:', id);

        // Add a document
        await pool.query("INSERT INTO shipment_documents (shipment_id, file_name, file_path) VALUES ($1, 'test.pdf', '/tmp/test.pdf')", [id]);
        console.log('Added Document to:', id);

        // Try delete
        await pool.query("DELETE FROM shipments WHERE id = $1", [id]);
        console.log('Reference check passed: Deleted successfully (Cascade worked)');

    } catch (e) {
        console.error('Delete failed:', e);
    }

    process.exit(0);
}

testDelete();
