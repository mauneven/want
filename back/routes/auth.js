const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Registro de usuario
router.post('/register', authController.register);

// Inicio de sesión de usuario
router.post('/login', authController.login);

// Cierre de sesión de usuario
router.delete('/logout', authController.logout);

module.exports = router;
