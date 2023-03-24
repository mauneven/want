// authRoutes
const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/user', userController.getCurrentUser);
router.put('/users/me', userController.updateCurrentUser);

module.exports = router;