const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all movies (public route)
router.get('/', async (req, res) => {
  try {
    const [movies] = await db.query(
      `SELECT Movie_ID, Movie_Name, Genre, isPremium, Booking_Platform, OTTs, Details 
       FROM Movies`
    );
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while fetching movies' });
  }
});

// GET single movie by ID + list of actors
router.get('/:id', async (req, res) => {
  const movieId = req.params.id;
  try {
    // 1️⃣ Fetch movie details
    const [movieRows] = await db.query(
      `SELECT Movie_ID, Movie_Name, Genre, isPremium, Booking_Platform, OTTs, Details
       FROM Movies
       WHERE Movie_ID = ?`,
      [movieId]
    );

    if (movieRows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    const movie = movieRows[0];

    // 2️⃣ Fetch associated actors
    const [actorRows] = await db.query(
      `SELECT a.Actor_ID, a.Actor_Name
       FROM Actors a
       JOIN Acts_in ai ON a.Actor_ID = ai.Actor_ID
       WHERE ai.Movie_ID = ?`,
      [movieId]
    );

    movie.actors = actorRows; // attach actors to the movie object

    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while fetching movie details' });
  }
});

module.exports = router;
