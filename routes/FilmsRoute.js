const express = require("express");
const router = express.Router();
const { filmController } = require('../controllers/');

router.get('/:title', filmController.getByTitle);

router.post('/', filmController.saveFilm);

router.delete('/', filmController.deleteFilm);

module.exports = router;