import pool from '../config/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const sql = `
ALTER TABLE job_payments
ADD COLUMN IF NOT EXISTS voucher_no VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(50),
ADD COLUMN IF NOT EXISTS comments TEXT,
ADD COLUMN IF NOT EXISTS processed_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;
`;

async function run() {
    try {
        console.log('Running migration...');
        await pool.query(sql);
        console.log('Migration successful');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
