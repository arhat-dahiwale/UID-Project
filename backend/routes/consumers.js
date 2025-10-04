// backend/routes/consumers.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// register consumer
router.post('/register', async (req, res) => {
  const { email, password, dob, isPremium } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert into DB
    const [result] = await db.query(
      'INSERT INTO Consumers (Email_ID, Password, DOB, isPremium) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, dob || null, isPremium || 0]
    );

    res.status(201).json({
      message: 'consumer registered',
      consumerId: result.insertId
    });
  } catch (err) {
    console.error(err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already registered' });
    }

    res.status(500).json({ error: 'Database error' });
  }
});


// LOGIN consumer
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM Consumers WHERE Email_ID = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Consumer not found' });
    }

    const consumer = rows[0];
    const isMatch = await bcrypt.compare(password, consumer.Password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    
    const token = jwt.sign(
      { consumerId: consumer.Consumer_ID, role: 'consumer' }, // payload
      process.env.JWT_SECRET,                        // secret key
      { expiresIn: process.env.JWT_EXPIRES_IN }      // expiry
    );

    // calculate age if DOB exists
    let age = null;
    if (consumer.DOB) {
      const dob = new Date(consumer.DOB);
      const diff = Date.now() - dob.getTime();
      age = new Date(diff).getUTCFullYear() - 1970;
    }

    res.json({
      message: 'Login successful',
      token, 
      consumer: {
        consumerId: consumer.Consumer_ID,
        email: consumer.Email_ID,
        isPremium: consumer.isPremium,
        age
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Protected route example
const {authMiddleware} = require('../middleware/auth');     

// GET consumer profile (protected)
router.get('/profile', authMiddleware, async (req, res) => {  
  try {
    const [rows] = await db.query(
      'SELECT Consumer_ID, Email_ID, DOB, isPremium FROM Consumers WHERE Consumer_ID = ?',
      [req.user.consumerId]
    );      

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Consumer not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});



module.exports = router;
