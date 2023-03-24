const Post = require('../models/Post');

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('createdBy', 'firstName lastName');
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('createdBy', 'firstName lastName');
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, description, country, state, city, mainCategory, subCategory } = req.body;

    const post = new Post({
      title,
      description,
      createdBy: req.session.userId,
      country,
      state,
      city,
      mainCategory,
      subCategory
    });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};


exports.updatePost = async (req, res, next) => {
  try {
    const { title, description, country, state, city, mainCategory, subCategory } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (post.createdBy.toString() !== req.session.userId && req.user && req.user.role !== 'admin') {
      return res.status(401).send('You are not authorized to edit this post');
    }

    post.title = title;
    post.description = description;
    post.country = country;
    post.state = state;
    post.city = city;
    post.mainCategory = mainCategory;
    post.subCategory = subCategory;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};


exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (post.createdBy.toString() !== req.session.userId && req.user.role !== 'admin') {
      return res.status(401).send('You are not authorized to delete this post');
    }

    await Post.deleteOne({ _id: req.params.id });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};


exports.getPostsByCurrentUser = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).send('You must be logged in to view your posts');
    }

    const posts = await Post.find({ createdBy: req.session.userId }).populate(
      'createdBy',
      'firstName lastName'
    );
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};