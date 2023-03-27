const Offer = require('../models/Offer');
const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

exports.uploadPhoto = upload.single('photo');

exports.createOffer = async (req, res, next) => {
    try {
        const { title, description, price, postId } = req.body;
        const photo = req.file ? req.file.path : null;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        const offer = new Offer({
            title,
            description,
            price,
            photo,
            createdBy: req.session.userId,
            receivedBy: post.createdBy,
            post: postId
        });
        await offer.save();

        res.status(201).json(offer);
    } catch (err) {
        next(err);
    }
};

exports.getOffersByCurrentUser = async (req, res, next) => {
    try {
        const offers = await Offer.find({ createdBy: req.session.userId }).populate('post', 'title');
        res.status(200).json(offers);
    } catch (err) {
        next(err);
    }
};

exports.getOffersReceivedByCurrentUser = async (req, res, next) => {
    try {
        const offers = await Offer.find({ receivedBy: req.session.userId }).populate('post', 'title');
        res.status(200).json(offers);
    } catch (err) {
        next(err);
    }
};

exports.deleteOffer = async (req, res, next) => {
    try {
      const offer = await Offer.findById(req.params.id);
  
      if (!offer) {
        return res.status(404).send('Offer not found');
      }
  
      const isOfferCreatedByUser = offer.createdBy.toString() === req.session.userId;
      const isOfferReceivedByUser = offer.receivedBy.toString() === req.session.userId;
      const isAdmin = req.user && req.user.role === 'admin';
  
      if (!isOfferCreatedByUser && !isOfferReceivedByUser && !isAdmin) {
        return res.status(401).send('You are not authorized to delete this offer');
      }
  
      await Offer.deleteOne({ _id: req.params.id });
  
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };   

exports.createReport = async (req, res, next) => {
    try {
        const offerId = req.params.id;
        const { description } = req.body;

        const offer = await Offer.findById(offerId);
        if (!offer) {
            return res.status(404).send('Offer not found');
        }

        const report = new Report({
            description,
            createdBy: req.session.userId
        });

        await report.save();

        offer.reports.push(report);
        await offer.save();

        if (offer.reports.length === 1) {
            await Offer.deleteOne({ _id: offerId });
            // Aquí se debe agregar la lógica para incrementar el contador de reportes del usuario.
        }

        res.status(201).json(report);
    } catch (err) {
        next(err);
    }
};
