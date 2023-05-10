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
router.get('/is-logged-in', authController.checkLoggedIn);
router.get('/user', userController.getCurrentUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.put('/change-password', authController.changePassword);
router.get('/is-blocked', authController.checkBlocked);
router.post('/verify/:token', authController.verifyUser);
router.post('/resend-verification', authController.resendVerification);
router.get('/check-verified', authController.checkVerified);
router.delete('/delete-account', authController.deleteAccount);
router.put('/cancel-deletion-process', authController.cancelDeletionProcess);

module.exports = router;