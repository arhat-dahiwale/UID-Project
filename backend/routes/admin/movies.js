const express = require('express');
const router = express.Router();
const db = require('../../db');
const { authenticateAdmin } = require('../../middleware/auth');

// GET all movies (admin)
router.get("/", authenticateAdmin, async (req, res) => {
  res.json({ msg: "Movies list works!" });
});

// GET single movie by ID
router.get('/:id', authenticateAdmin, async (req, res) => {
  const movieId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM Movies WHERE Movie_ID = ?', [movieId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Movie not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST create new movie + actors
router.post('/', authenticateAdmin, async (req, res) => {
  const { Movie_Name, genre, isPremium, Booking_Platform, OTTs, Details, actors } = req.body;
  // ✅ `actors` should be an array of strings: ["Tom Cruise", "Emily Blunt"]

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // 1️⃣ Insert movie
    const [movieResult] = await connection.query(
      `INSERT INTO Movies 
       (Movie_Name, genre, isPremium, Booking_Platform, OTTs, Details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Movie_Name, genre, isPremium || 0, Booking_Platform, OTTs, Details]
    );
    const movieId = movieResult.insertId;

    // 2️⃣ Insert actors and map them to this movie
    if (actors && actors.length > 0) {
      for (const actorName of actors) {
        // Check if actor already exists
        const [existing] = await connection.query(
          `SELECT Actor_ID FROM Actors WHERE Actor_Name = ?`,
          [actorName]
        );

        let actorId;
        if (existing.length > 0) {
          actorId = existing[0].Actor_ID;
        } else {
          // Create new actor
          const [actorResult] = await connection.query(
            `INSERT INTO Actors (Actor_Name) VALUES (?)`,
            [actorName]
          );
          actorId = actorResult.insertId;
        }

        // Link movie ↔ actor in Acts_in
        await connection.query(
          `INSERT INTO Acts_in (Movie_ID, Actor_ID) VALUES (?, ?)`,
          [movieId, actorId]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ message: 'Movie and actors added successfully', Movie_ID: movieId });

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: 'Database error during insert' });
  } finally {
    connection.release();
  }
});

// PUT update movie + actors
router.put('/:id', authenticateAdmin, async (req, res) => {
  const movieId = req.params.id;
  const { Movie_Name, genre, isPremium, Booking_Platform, OTTs, Details, actors } = req.body;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // 1️⃣ Update movie details
    const [result] = await connection.query(
      `UPDATE Movies SET 
       Movie_Name = ?, 
       Genre = ?, 
       isPremium = ?, 
       Booking_Platform = ?, 
       OTTs = ?, 
       Details = ?
       WHERE Movie_ID = ?`,
      [Movie_Name, genre, isPremium, Booking_Platform, OTTs, Details, movieId]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Movie not found' });
    }

    // 2️⃣ Clear old associations
    await connection.query(`DELETE FROM Acts_in WHERE Movie_ID = ?`, [movieId]);

    // 3️⃣ Reinsert actor associations
    if (actors && actors.length > 0) {
      for (const actorName of actors) {
        const [existing] = await connection.query(
          `SELECT Actor_ID FROM Actors WHERE Actor_Name = ?`,
          [actorName]
        );

        let actorId;
        if (existing.length > 0) {
          actorId = existing[0].Actor_ID;
        } else {
          const [actorResult] = await connection.query(
            `INSERT INTO Actors (Actor_Name) VALUES (?)`,
            [actorName]
          );
          actorId = actorResult.insertId;
        }

        await connection.query(
          `INSERT INTO Acts_in (Movie_ID, Actor_ID) VALUES (?, ?)`,
          [movieId, actorId]
        );
      }
    }

    await connection.commit();
    res.json({ message: 'Movie and actors updated successfully' });

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: 'Database error during update' });
  } finally {
    connection.release();
  }
});

// DELETE movie
router.delete('/:id', authenticateAdmin, async (req, res) => {
  const movieId = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM Movies WHERE Movie_ID = ?', [movieId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
