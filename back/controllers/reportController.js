const Post = require('../models/post');
const Report = require('../models/report');
const User = require('../models/user');
const Offer = require('../models/offer');

// controllers/reportController.js

exports.createPostReport = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { description } = req.body;

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

      if (updatedUser.reports.length >= 2) {
        updatedUser.isBlocked = true;
        await updatedUser.save();
      }
    }

    if (post.reports.length >= 1) {
      await Post.deleteOne({ _id: postId });
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

    if (updatedUser.reports.length >= 2) {
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

      if (updatedUser.reports.length >= 2) {
        updatedUser.isBlocked = true;
        await updatedUser.save();
      }
    }

    if (offer.reports.length >= 1) {
      await Offer.deleteOne({ _id: offerId });
    }

    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};