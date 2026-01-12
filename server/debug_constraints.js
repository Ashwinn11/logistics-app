import pool from './config/database.js';

async function checkConstraints() {
    try {
        console.log('Checking constraints...');

        const tables = ['shipment_documents', 'delivery_notes'];

        for (const table of tables) {
            const res = await pool.query(`
                SELECT
                    tc.table_schema, 
                    tc.constraint_name, 
                    tc.table_name, 
                    kcu.column_name, 
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name,
                    rc.delete_rule 
                FROM 
                    information_schema.table_constraints AS tc 
                    JOIN information_schema.key_column_usage AS kcu
                      ON tc.constraint_name = kcu.constraint_name
                      AND tc.table_schema = kcu.table_schema
                    JOIN information_schema.constraint_column_usage AS ccu
                      ON ccu.constraint_name = tc.constraint_name
                      AND ccu.table_schema = tc.table_schema
                    JOIN information_schema.referential_constraints AS rc
                      ON rc.constraint_name = tc.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1;
            `, [table]);

            console.log(`\nConstraints for ${table}:`);
            res.rows.forEach(row => {
                console.log(`  - Name: ${row.constraint_name}`);
                console.log(`    Column: ${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name}`);
                console.log(`    Delete Rule: ${row.delete_rule}`);
            });
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkConstraints();
