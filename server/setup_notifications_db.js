
import pool from './config/database.js';

async function checkNotifications() {
    try {
        const res = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'notifications'
      );
    `);
        console.log('Exists:', res.rows[0].exists);
        if (!res.rows[0].exists) {
            console.log('Creating table...');
            await pool.query(`
            CREATE TABLE notifications (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                message TEXT,
                type VARCHAR(50) DEFAULT 'info',
                is_read BOOLEAN DEFAULT FALSE,
                link VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
            console.log('Table created.');
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkNotifications();
