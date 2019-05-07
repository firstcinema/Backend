const express = require("express");
const Film = require("../models/Film");
const router = express.Router();

// Get
router.get("/:title", (req, res, next) => {
  Film.search(req.params.title, (error, film) => {
    if (error) throw error;
    res.status(200).send(film);
  });
});

// Delete
router.delete("/", (req, res, next) => {
  Film.deleteFilm(req.body.filmId, () => {
    return res.status(200).json({
      success: true,
      message: "Successfully Deleted"
    });
  });
});

// Insert
router.post("/", (req, res, next) => {
  Film.search(req.body.title, (error, film) => {
    if (error) throw error;
    if (film) {
      return res.json({
        success: false,
        message: "A film already exists with that name"
      });
    }

    let newFilm = new Film({
      title: req.body.title,
      overview: req.body.overview,
      releaseDate: req.body.releaseDate,
      trailer: req.body.trailer
    });

    Object.assign(newFilm, {
      cast: req.body.cast,
      crew: req.body.crew,
      genres: req.body.genres,
      keywords: req.body.keywords
    });

    Film.addFilm(newFilm, (err, film) => {
      if (err) {
        return res.json({
          success: false,
          message: "Failed attempt to insert film."
        });
      }
      res.json({
        success: true,
        message: "Film Saved!"
      });
    });
  });
});

module.exports = router;
