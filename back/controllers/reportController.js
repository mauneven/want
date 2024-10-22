const Post = require('../models/post');
const Report = require('../models/report');
const User = require('../models/user');
const Offer = require('../models/offer');
const path = require('path');
const fs = require('fs');
const Notification = require('../models/notification');
const { isUserVerified } = require('./authController')

// controllers/reportController.js

async function deleteOffersAndPhotos(postId) {
  const offers = await Offer.find({ post: postId });

  for (const offer of offers) {
    if (offer.photo) {
      const imagePath = path.join(__dirname, '..', offer.photo);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error al eliminar la imagen:', err);
        } else {
          console.log('Imagen eliminada:', imagePath);
        }
      });
    }
    await Offer.deleteOne({ _id: offer._id });
  }
}

exports.createPostReport = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { description } = req.body;

    if (!(await isUserVerified(req.session.userId))) {
      return res.status(403).send('User no verified');
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    const existingReport = await Report.findOne({ postId: postId, createdBy: req.session.userId });
    if (existingReport) {
      return res.status(400).send('Ya has reportado este post');
    }

    const report = new Report({
      description,
      postId,
      createdBy: req.session.userId
    });

    await report.save();

    post.reports.push(report);
    await post.save();

    const user = await User.findById(post.createdBy);
    if (user) {
      user.reports.push(report);
      await user.save();

      const updatedUser = await User.findById(post.createdBy).populate('reports');

      if (updatedUser.reports.length >= 15) {
        updatedUser.isBlocked = true;
        await updatedUser.save();
      }
    }

    if (post.reports.length >= 5) {
      // Eliminar la imagen asociada con el post
      if (post.photo) {
        const imagePath = path.join(__dirname, '..', post.photo);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error al eliminar la imagen:', err);
          } else {
            console.log('Imagen eliminada:', imagePath);
          }
        });
      }
      await Post.deleteOne({ _id: postId });
    
      // Eliminar las ofertas y sus fotos relacionadas con el post eliminado
      await deleteOffersAndPhotos(postId);
    }
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};

exports.createUserReport = async (req, res, next) => {
  try {

    const userId = req.params.id;
    const { description } = req.body;

    if (!(await isUserVerified(req.session.userId))) {
      return res.status(403).send('User no verified');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const report = new Report({
      description,
      createdBy: req.session.userId
    });

    await report.save();

    user.reports.push(report);
    await user.save();

    const updatedUser = await User.findById(userId).populate('reports');

    if (updatedUser.reports.length >= 15) {
      updatedUser.isBlocked = true;
      await updatedUser.save();
    }

    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};

exports.createOfferReport = async (req, res, next) => {
  try {

    const offerId = req.params.id;
    const { description } = req.body;

    if (!(await isUserVerified(req.session.userId))) {
      return res.status(403).send('User no verified');
    }

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

    const user = await User.findById(offer.createdBy);
    if (user) {
      user.reports.push(report);
      await user.save();

      const updatedUser = await User.findById(offer.createdBy).populate('reports');

      if (updatedUser.reports.length >= 15) {
        updatedUser.isBlocked = true;
        await updatedUser.save();
      }
    }

    if (offer.reports.length >= 1) {
      // Eliminar la imagen asociada con la oferta
      if (offer.photo) {
        const imagePath = path.join(__dirname, '..', offer.photo);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error al eliminar la imagen:', err);
          } else {
            console.log('Imagen eliminada:', imagePath);
          }
        });
      }
      await Offer.deleteOne({ _id: offerId });
    
      // Encuentra la notificación correspondiente al offerId de la oferta que se está eliminando.
      const offerRegex = new RegExp(`Offer ${offer._id}`);
      const notification = await Notification.findOne({ content: { $regex: offerRegex } });
    
      // Elimina la notificación relacionada con la oferta reportada
      if (notification) {
        await Notification.deleteOne({ _id: notification._id });
      }
    }

    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};