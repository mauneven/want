// routes/offerRoutes.js

const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

router.post('/create', offerController.uploadPhoto, offerController.createOffer);
router.get('/sent', offerController.getOffersByCurrentUser);
router.get('/received', offerController.getOffersReceivedByCurrentUser);
router.delete('/:id', offerController.deleteOffer);
router.post('/:id/report', offerController.createReport);
router.get('/my-offers', offerController.getOffersByCurrentUser);
router.get('/notifications', offerController.getNotifications);
router.patch('/notifications/:id/read', offerController.markNotificationAsRead);

module.exports = router;