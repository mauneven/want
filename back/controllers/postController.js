const Post = require('../models/post');
const multer = require('multer');
const path = require('path');
const Offer = require('../models/offer');
const Notification = require('../models/notification');
const fs = require('fs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const url = require('url');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).array('photos[]', 4);

exports.uploadPhotoMiddleware = upload;

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('createdBy', 'firstName lastName photo');
    res.status(200).json(posts);
    console.log(createdBy);
  } catch (err) {
    next(err);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('createdBy', 'firstName lastName photo');
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
    const { title, description, country, state, city, mainCategory, subCategory, price } = req.body;
    const photos = req.files.map(file => file.path);
    let compressedImagePaths = []; // Add this line

    if (photos.length > 0) {
      compressedImagePaths = await Promise.all(photos.map(async (photos) => {
        const compressedImagePath = `uploads/${uuidv4()}.jpg`;
        await sharp(photos).resize({ width: 500 }).toFile(compressedImagePath);
        try {
          await fs.promises.unlink(photos);
        } catch (err) {
          console.error(`Error deleting file ${photos}: ${err.message}`);
        }
        return compressedImagePath;
      }));

      req.files = compressedImagePaths.map(path => ({ path }));
    }

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
      photos: compressedImagePaths || [],

    });
    await post.save();

    exports.schedulePostDeletion(post._id, 60 * 60 * 24 * 7 * 1000); // 7 Days

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

    const { title, description, country, state, city, mainCategory, subCategory, price, deletedImages } = req.body;

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

    if (deletedImages) {
      const deletedImagePaths = deletedImages.split(',');
      post.photos = post.photos.filter(photo => !deletedImagePaths.includes(photo));

      await Promise.all(deletedImagePaths.map(async (imagePath) => {
        const parsedUrl = url.parse(imagePath);
        const localPath = parsedUrl.pathname;
        const oldPhotoPath = path.join(__dirname, '..', localPath);
        try {
          await fs.promises.unlink(oldPhotoPath);
        } catch (err) {
          console.error(`Error deleting file ${oldPhotoPath}: ${err.message}`);
        }
      }));
    }

    if (req.files.length > 0) {
      const photos = req.files.map(file => file.path);
      const compressedImagePaths = await Promise.all(photos.map(async (photo) => {
        const compressedImagePath = `uploads/${uuidv4()}.jpg`;
        await sharp(photo).resize({ width: 500 }).toFile(compressedImagePath);
        try {
          await fs.promises.unlink(photo);
        } catch (err) {
          console.error(`Error deleting file ${photo}: ${err.message}`);
        }
        return compressedImagePath;
      }));
      req.files = compressedImagePaths.map(path => ({ path }));

      post.photos = [...post.photos, ...compressedImagePaths];
    }

    await Promise.all(post.photos.map(async (photo) => {
      const exists = await fs.promises.access(photo, fs.constants.F_OK).then(() => true).catch(() => false);
      if (!exists) {
        post.photos.pull(photo);
      }
    }));

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

    // Buscar todas las ofertas asociadas con este post
    const offers = await Offer.find({ post: req.params.id });

    // Eliminar las fotos de las ofertas asociadas con este post
    for (const offer of offers) {
      if (offer.photos) {
        for (const photo of offer.photos) { // Añade este bucle para iterar sobre el array de fotos
          try {
            const imagePath = path.join(__dirname, '..', photo);
            fs.unlinkSync(imagePath);
          } catch (err) {
            console.error(`Error deleting image for offer ${offer._id}: ${err.message}`);
          }
        }
      }
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

exports.deletePostById = async (postId) => {
  const post = await Post.findById(postId);

  // Verificar si el post ya ha sido eliminado
  if (!post) {
    console.log('Post already deleted');
    return;
  }

  // Buscar todas las ofertas asociadas con este post
  const offers = await Offer.find({ post: postId });

  // Eliminar las fotos de las ofertas asociadas con este post
  for (const offer of offers) {
    if (offer.photos) {
      try {
        const imagePath = path.join(__dirname, '..', offer.photos);
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error(`Error deleting image for offer ${offer._id}: ${err.message}`);
      }
    }
  }

  // Eliminar las ofertas y notificaciones relacionadas con el post
  await Offer.deleteMany({ post: postId });
  await Notification.deleteMany({ postId });

  // Eliminar las imágenes del post
  if (post.photos) {
    for (const photos of post.photos) {
      try {
        const imagePath = path.join(__dirname, '..', photos);
        await fs.promises.unlink(imagePath);
      } catch (err) {
        console.error(`Error deleting image for post ${postId}: ${err.message}`);
      }
    }
  }

  await Post.deleteOne({ _id: postId });
};

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
      'firstName lastName photo'
    );
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

exports.isPostCreatedByUser = async (userId, postId) => {
  const post = await Post.findById(postId);
  if (!post) {
    return false;
  }
  return post.createdBy.toString() === userId;
};


