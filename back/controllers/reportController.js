// controllers/reportController.js

const Post = require('../models/post');
const Report = require('../models/report');

exports.createReport = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { description } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    const report = new Report({
      description,
      createdBy: req.session.userId
    });

    await report.save();

    post.reports.push(report);
    await post.save();

    // Si hay más de 5 reportes, eliminar el post automáticamente
    if (post.reports.length > 5) {
      await Post.deleteOne({ _id: postId });
    }

    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};
