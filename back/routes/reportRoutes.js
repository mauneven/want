const { isLoggedIn } = require('../controllers/authController');
const express = require('express');
const reportController = require('../controllers/reportController');

const router = express.Router();

router.post('/report/post/:id', isLoggedIn, reportController.createPostReport);
router.post('/report/user/:id', isLoggedIn, reportController.createUserReport);
router.post('/report/offer/:id', isLoggedIn, reportController.createOfferReport);

module.exports = router;