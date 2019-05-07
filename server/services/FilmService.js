const Film = require("../models/Film");

const saveFilm = (content, callback) => {
  let film = Object.assign(new Film(), content);
  Film.addFilm(film, err => {
    callback(err, film);
  });
};

const deleteFilm = filmId => {
  Film.deleteById(filmId, error => {
    if (error) throw error;
  });
};

const findFilms = (conditions, callback) => {
  Film.findFilms(conditions, callback);
};

module.exports = {
  saveFilm,
  deleteFilm,
  findFilms
};
