const express = require('express');
const router = express.Router();
const tryController = require('../controllers/tryController');

router.use((req, res, next) => {
  console.log(`Método: ${req.method} - Ruta: ${req.originalUrl}`);
  next();
});
router.get('/hello', tryController.getHello);

module.exports = router;
