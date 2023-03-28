const express = require('express');
const router = express.Router();
const { getCurrentUser } = require('../controllers/currentUserController');

router.get('/', getCurrentUser);

module.exports = router;
