// authRoutes
const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.put('/users/me', userController.uploadPhotoMiddleware, userController.updateCurrentUser);
router.get('/is-logged-in', authController.isLoggedIn);
router.get('/user', userController.getCurrentUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);


module.exports = router;