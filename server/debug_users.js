import pool from './config/database.js';

async function listUsers() {
    try {
        const res = await pool.query("SELECT id, username, role FROM users");
        console.table(res.rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
listUsers();
