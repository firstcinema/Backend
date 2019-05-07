const express = require("express");
const router = express.Router();
const { userController } = require('../controllers/');

router.post('/', userController.createUser);

router.put('/:userId', userController.updateUser);

router.delete('/', userController.deleteUser);

router.get('/', userController.findUser);

router.get('/paged/:page', userController.pagedUsers);

router.get("/:userName", userController.findOneUser);

router.post('/confirmation', userController.confirmUser);

// router.post('/resendConfirmation', userController.resendTokenPost);

module.exports = router;