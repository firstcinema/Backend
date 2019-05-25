const mongoose = require("mongoose");

const FilmSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    trailer: {
        type: String,
        required: false
    },
    cast: [String],
    crew: [String],
    genres: [String],
    keywords: [String]
});

const Film = (module.exports = mongoose.model("Film", FilmSchema));

function search(query, callback) {
    return Film.find({ title: query }, callback);
};

function addFilm(film, callback) {
    film.save(callback);
};

function deleteFilm(filmId, callback) {
    Film.findByIdAndDelete({ _id: filmId }, callback);
};

module.exports = {
    search,
    addFilm,
    deleteFilm
}