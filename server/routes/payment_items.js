
import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

// Get all payment items
router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM payment_items ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching payment items:', error);
        // Fallback if table doesn't exist yet, return empty array to prevent frontend crash
        if (error.code === '42P01') {
            return res.json([]);
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create payment item
router.post('/', authenticateToken, async (req, res) => {
    const { name, vendor_id } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        // Simple check if table exists, if not, create it (Dev convenience)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payment_items (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                vendor_id INTEGER REFERENCES vendors(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const result = await pool.query(
            'INSERT INTO payment_items (name, vendor_id) VALUES ($1, $2) RETURNING *',
            [name, vendor_id || null]
        );

        await logActivity(req.user.id, 'CREATE_PAYMENT_ITEM', `Created payment item: ${name}`, 'PAYMENT_ITEM', result.rows[0].id);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating payment item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update payment item
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, vendor_id } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const result = await pool.query(
            'UPDATE payment_items SET name = $1, vendor_id = $2 WHERE id = $3 RETURNING *',
            [name, vendor_id || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Payment item not found' });
        }

        await logActivity(req.user.id, 'UPDATE_PAYMENT_ITEM', `Updated payment item: ${name}`, 'PAYMENT_ITEM', id);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating payment item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete payment item
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM payment_items WHERE id = $1', [req.params.id]);
        await logActivity(req.user.id, 'DELETE_PAYMENT_ITEM', `Deleted payment item ID: ${req.params.id}`, 'PAYMENT_ITEM', req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
