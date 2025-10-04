// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Helper: hash the password with SHA-256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Admin login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const [rows] = await db.query(
            'SELECT * FROM Admin WHERE Email_ID = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const admin = rows[0];

        // Hash incoming password and compare with stored hash
        const hashedInput = hashPassword(password);
        if (hashedInput !== admin.Password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // JWT generation
        const token = jwt.sign(
            { adminId: admin.Admin_ID, role: 'admin' },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '2h' }
        );

        res.json({
            message: 'Login successful',
            adminId: admin.Admin_ID,
            adminName: admin.Admin_Name,
            role: 'admin',
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
