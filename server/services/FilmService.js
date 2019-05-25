const Film = require("../models/Film");

function saveFilm(content, callback) {
    let film = Object.assign(new Film(), content);
    Film.addFilm(film, err => {
        callback(err, film);
    });
}

function deleteFilm(filmId) {
    Film.deleteById(filmId, error => {
        if (error) throw error;
    });
}

function findFilms(conditions, callback) {
    Film.findFilms(conditions, callback);
}

module.exports = {
    saveFilm,
    deleteFilm,
    findFilms
}