const Post = require('../models/post');
const multer = require('multer');
const path = require('path');
const Offer = require('../models/offer');
const Notification = require('../models/notification');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.uploadPhotoMiddleware = upload.single('photo');

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

// controllers/postController.js

exports.createPost = async (req, res, next) => {
  try {
    const { title, description, country, state, city, mainCategory, subCategory,price } = req.body;
    const photo = req.file ? req.file.path : null;

    const post = new Post({
      title,
      description,
      createdBy: req.session.userId,
      country,
      state,
      city,
      mainCategory,
      subCategory,
      price,
      photo
    });
    await post.save();

    exports.schedulePostDeletion(post._id, 60 * 60 * 24 * 7 * 1000);

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).send('You must be logged in to edit a post');
    }

    const { title, description, country, state, city, mainCategory, subCategory, price } = req.body;

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
    post.price = price;

    if (req.file) {
      if (post.photo) {
        // Elimina la foto anterior si existe
        const oldPhotoPath = path.join(__dirname, '..', post.photo);
        fs.unlink(oldPhotoPath, (err) => {
          if (err) {
            console.error('Error removing old post picture:', err);
          }
        });
      }
      // Guarda la URL de la nueva foto en la base de datos
      post.photo = req.file.path;
    }

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

    if (post.createdBy.toString() !== req.session.userId) {
      return res.status(401).send('You are not authorized to delete this post');
    }

    // Eliminar las ofertas y notificaciones relacionadas con el post
    await Offer.deleteMany({ post: req.params.id });
    await Notification.deleteMany({ postId: req.params.id });

    await exports.deletePostById(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

// controllers/postController.js

exports.deletePostById = async (postId) => {
  const post = await Post.findById(postId);

  // Verificar si el post ya ha sido eliminado
  if (!post) {
    console.log('Post already deleted');
    return;
  }

  // Eliminar las ofertas y notificaciones relacionadas con el post
  await Offer.deleteMany({ post: postId });
  await Notification.deleteMany({ postId });

  // Eliminar la imagen del post
  if (post.photo) {
    try {
      const fs = require('fs');
      const path = require('path');
      const imagePath = path.join(__dirname, '..', post.photo);
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.error(`Error deleting image for post ${postId}: ${err.message}`);
    }
  }

  await Post.deleteOne({ _id: postId });
};


// controllers/postController.js

exports.schedulePostDeletion = async (postId, delay) => {
  setTimeout(async () => {
    try {
      await exports.deletePostById(postId);
    } catch (err) {
      console.error(`Error deleting post ${postId}: ${err.message}`);
    }
  }, delay);
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

