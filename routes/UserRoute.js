const express = require("express");
const router = express.Router();
const { userController } = require('../controllers/');

router.post('/', userController.createUser);

router.post('/password', userController.changePassword);

router.put('/:userId', userController.updateUser);

router.delete('/', userController.deleteUser);

router.get('/', userController.findUser);

router.get('/paged/:page', userController.pagedUsers);

router.get('/:userName', userController.findSingleUser);

router.get('/confirmation/:token', userController.confirmUser);




router.post('/resendConfirmation', userController.resendTokenPost);

router.post('/follow', userController.followUser);

router.post('/unfollow', userController.unfollowUser);

module.exports = router;