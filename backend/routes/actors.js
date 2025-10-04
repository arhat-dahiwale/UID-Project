//routes/actors.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET actors for a specific movie
router.get('/movie/:movieId', async (req, res) => {
  const movieId = req.params.movieId;
  try {
    const [actors] = await db.query(
      `SELECT a.Actor_ID, a.Actor_Name
       FROM Actors a
       JOIN Acts_in ai ON a.Actor_ID = ai.Actor_ID
       WHERE ai.Movie_ID = ?`,
      [movieId]
    );
    res.json(actors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
