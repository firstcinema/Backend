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

const search = (query, callback) => {
    return Film.find({ title: query }, callback);
};

const addFilm = (film, callback) => {
    film.save(callback);
};

const deleteFilm = (filmId, callback) => {
    Film.findByIdAndDelete({ _id: filmId }, callback);
};

module.exports = {
    search,
    addFilm,
    deleteFilm
}