// backend/routes/payments.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const crypto = require('crypto');

// Dummy in-memory payment store for verification
const paymentsStore = {}; // { paymentId: { consumerId, planType, status } }

/**
 * POST /payments/create
 * Creates a new payment intent/order
 * Body: { planType }
 */
router.post('/create', authMiddleware, async (req, res) => {
    const { planType } = req.body;
    const consumerId = req.user.consumerId;

    if (!planType || planType !== 'premium') {
        return res.status(400).json({ error: 'Invalid plan type' });
    }

    try {
        // Generate dummy payment ID
        const paymentId = crypto.randomBytes(8).toString('hex');

        // Store payment info temporarily
        paymentsStore[paymentId] = {
            consumerId,
            planType,
            status: 'pending'
        };

        // Amount can be fixed or fetched from plan
        const amount = 499; // Example: premium plan ₹499

        res.json({
            message: 'Payment created',
            paymentId,
            amount,
            currency: 'INR'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating payment' });
    }
});

/**
 * POST /payments/verify
 * Verify payment and update premium status
 * Body: { paymentId }
 */
router.post('/verify', authMiddleware, async (req, res) => {
    const { paymentId } = req.body;
    const consumerId = req.user.consumerId;

    if (!paymentId || !paymentsStore[paymentId]) {
        return res.status(400).json({ error: 'Invalid payment ID' });
    }

    const payment = paymentsStore[paymentId];

    if (payment.consumerId !== consumerId) {
        return res.status(403).json({ error: 'Payment does not belong to this user' });
    }

    // Simulate verification success
    payment.status = 'success';

    try {
        // Update consumer to premium
        await db.query('UPDATE Consumers SET isPremium = 1 WHERE Consumer_ID = ?', [consumerId]);

        res.json({
            message: 'Payment verified, premium activated',
            consumerId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error during premium activation' });
    }
});

/**
 * GET /payments/status
 * Check if current consumer is premium
 */
router.get('/status', authMiddleware, async (req, res) => {
    const consumerId = req.user.consumerId;

    try {
        const [rows] = await db.query('SELECT isPremium FROM Consumers WHERE Consumer_ID = ?', [consumerId]);
        if (rows.length === 0) return res.status(404).json({ error: 'Consumer not found' });

        res.json({ consumerId, isPremium: !!rows[0].isPremium });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
