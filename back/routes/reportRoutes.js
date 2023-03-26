// routes/reportRoutes.js

const express = require('express');
const reportController = require('../controllers/reportController');

const router = express.Router();

router.post('/posts/:id/report', reportController.createReport);

module.exports = router;
