const { filmService } = require('../services/');

const getByTitle = (req, res) => {
    filmService.find({
        title: req.params.title
    }, (error, film) => {
        if (error) throw error;
        res.status(200).json({
            success: true,
            message: 'Film found',
            film: film
        });
    });
}

const saveFilm = (req, res) => {
    filmService.find({
        title: req.body.title
    }, (error, film) => {
        if (error) throw error;

        if (film) {
            return res.status(400).json({
                success: false,
                message: 'A film with this title already exists.'
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

        Film.addFilm(newFilm, (error, film) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(200).json({
                success: true,
                message: 'Film Saved'
            })
        });
    });
}

const deleteFilm = (req, res) => {
    Film.deleteFilm(req.body.filmId, (error) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully Deleted'
        });
    });
}

module.exports = {
    getByTitle,
    saveFilm,
    deleteFilm
}