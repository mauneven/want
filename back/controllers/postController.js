const Post = require("../models/post");
const multer = require("multer");
const path = require("path");
const Offer = require("../models/offer");
const Notification = require("../models/notification");
const fs = require("fs");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const url = require("url");
const User = require("../models/user");
const geolib = require("geolib");
const { getWss } = require("./webSocket");
const WebSocket = require("ws");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).array("photos[]", 4);

exports.uploadPhotoMiddleware = upload;

exports.createPost = async (req, res, next) => {
  try {
    const { title, description, latitude, longitude, mainCategory, price } =
      req.body;
    const photos = req.files.map((file) => ({
      type: file.mimetype,
      path: file.path,
      originalname: file.originalname,
    }));
    let compressedImagePaths = [];

    if (photos.length > 0) {
      compressedImagePaths = await Promise.all(
        photos.map(async (photo) => {
          const compressedImagePath = `uploads/${uuidv4()}.webp`;
          const fileBuffer = await fs.promises.readFile(photo.path);
          await sharp(fileBuffer)
            .resize({ width: 500 })
            .toFormat("webp")
            .toFile(compressedImagePath);
          await fs.promises.unlink(photo.path);
          return compressedImagePath;
        })
      );

      req.files = compressedImagePaths.map((path) => ({ path }));
    }

    const newPosition = geolib.computeDestinationPoint(
      { latitude, longitude },
      1000,
      Math.random() * 360
    );
    const newLatitude = newPosition.latitude;
    const newLongitude = newPosition.longitude;

    const post = new Post({
      title,
      description,
      createdBy: req.session.userId,
      latitude: newLatitude,
      longitude: newLongitude,
      mainCategory,
      price,
      photos: compressedImagePaths || [],
    });
    await post.save();

    await User.findByIdAndUpdate(req.session.userId, {
      $inc: { totalPosts: 1 },
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).send("You must be logged in to edit a post");
    }

    const {
      title,
      description,
      latitude,
      longitude,
      mainCategory,
      price,
      deletedImages,
    } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (
      post.createdBy.toString() !== req.session.userId &&
      req.user &&
      req.user.role !== "admin"
    ) {
      return res.status(401).send("You are not authorized to edit this post");
    }

    post.title = title;
    post.description = description;

    const newLatitude = Number(latitude);
    const newLongitude = Number(longitude);

    if (post.latitude !== newLatitude || post.longitude !== newLongitude) {
      const newPosition = geolib.computeDestinationPoint(
        { latitude: newLatitude, longitude: newLongitude },
        1000,
        Math.random() * 360
      );

      post.latitude = newPosition.latitude;
      post.longitude = newPosition.longitude;
    }

    post.mainCategory = mainCategory;
    post.price = price;

    const photoOrder = JSON.parse(req.body.photoOrder);
    let newPhotos = [];

    if (req.files.length > 0) {
      const photos = req.files.map((file) => ({
        type: file.mimetype,
        path: file.path,
        originalname: file.originalname,
      }));

      newPhotos = await Promise.all(
        photos.map(async (photo) => {
          const compressedImagePath = `uploads/${uuidv4()}.webp`;
          const fileBuffer = await fs.promises.readFile(photo.path);
          await sharp(fileBuffer)
            .resize({ width: 500 })
            .toFormat("webp")
            .toFile(compressedImagePath);
          await fs.promises.unlink(photo.path);
          return compressedImagePath;
        })
      );
    }

    if (photoOrder.length > 0) {
      const reorderedPhotos = photoOrder
        .map((photoId, index) => {
          if (photoId.startsWith("initial-")) {
            return post.photos.find((p) =>
              p.includes(photoId.split("/").pop())
            );
          } else if (photoId.startsWith("file-") && newPhotos[index]) {
            return newPhotos[index];
          }
        })
        .filter((p) => p);

      post.photos = reorderedPhotos;
    }

    if (deletedImages) {
      const deletedImagePaths = deletedImages.split(",");
      await Promise.all(
        deletedImagePaths.map(async (imagePath) => {
          const parsedUrl = url.parse(imagePath);
          const localPath = parsedUrl.pathname;
          const oldPhotoPath = path.join(__dirname, "..", localPath);
          try {
            await fs.promises.unlink(oldPhotoPath);
            const index = post.photos.findIndex((photo) => photo === localPath);
            if (index !== -1) {
              post.photos.splice(index, 1);
            }
          } catch (err) {
            console.error(
              `Error deleting file ${oldPhotoPath}: ${err.message}`
            );
          }
        })
      );
    }

    await Promise.all(
      post.photos.map(async (photo) => {
        const exists = await fs.promises
          .access(photo, fs.constants.F_OK)
          .then(() => true)
          .catch(() => false);
        if (!exists) {
          post.photos.pull(photo);
        }
      })
    );

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
      return res.status(404).send("Post not found");
    }

    if (post.createdBy.toString() !== req.session.userId) {
      return res.status(401).send("You are not authorized to delete this post");
    }

    const offers = await Offer.find({ post: req.params.id });

    for (const offer of offers) {
      if (offer.photos) {
        for (const photo of offer.photos) {
          try {
            const imagePath = path.join(__dirname, "..", photo);
            fs.unlinkSync(imagePath);
          } catch (err) {
            console.error(
              `Error deleting image for offer ${offer._id}: ${err.message}`
            );
          }
        }
      }
    }

    await Offer.deleteMany({ post: req.params.id });
    await Notification.deleteMany({ postId: req.params.id });

    const wss = getWss();

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "POST_DELETED",
            postId: req.params.id,
          })
        );
      }
    });

    await exports.deletePostById(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.deletePostById = async (postId) => {
  const post = await Post.findById(postId);

  if (!post) {
    console.log("Post already deleted");
    return;
  }

  const offers = await Offer.find({ post: postId });

  for (const offer of offers) {
    if (offer.photos) {
      for (const photo of offer.photos) {
        try {
          const imagePath = path.join(__dirname, "..", photo);
          await fs.promises.unlink(imagePath);
        } catch (err) {
          console.error(
            `Error deleting image for offer ${offer._id}: ${err.message}`
          );
        }
      }
    }
  }

  await Offer.deleteMany({ post: postId });
  await Notification.deleteMany({ postId });

  if (post.photos) {
    for (const photo of post.photos) {
      try {
        const imagePath = path.join(__dirname, "..", photo);
        await fs.promises.unlink(imagePath);
      } catch (err) {
        console.error(
          `Error deleting image for post ${postId}: ${err.message}`
        );
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

exports.getAllPosts = async (req, res, next) => {
  try {
    const filters = {};

    if (req.query.mainCategory) {
      filters["mainCategory"] = req.query.mainCategory;
    }

    if (req.query.searchTerm) {
      filters["$or"] = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { description: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    const mainCategoryPreferences = JSON.parse(
      req.query.mainCategoryPreferences || "{}"
    );

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    let allPosts = await Post.find(filters)
      .sort({ createdAt: -1 })
      .populate({
        path: "createdBy",
        select: "firstName totalPosts totalOffers lastName photo createdAt",
        populate: {
          path: "reports",
          select: "_id",
        },
      });

    if (
      req.query.latitude &&
      req.query.longitude &&
      req.query.radius &&
      !isNaN(req.query.latitude) &&
      !isNaN(req.query.longitude) &&
      !isNaN(req.query.radius)
    ) {
      const userLocation = {
        latitude: parseFloat(req.query.latitude),
        longitude: parseFloat(req.query.longitude),
      };
      const radius = parseFloat(req.query.radius) * 1000;

      allPosts = allPosts.filter((post) => {
        if (!isNaN(post.latitude) && !isNaN(post.longitude)) {
          const postLocation = {
            latitude: parseFloat(post.latitude),
            longitude: parseFloat(post.longitude),
          };

          const distance = geolib.getDistance(userLocation, postLocation, 1);

          return distance <= radius;
        }

        return false;
      });
    }

    allPosts.sort((a, b) => {
      const aViews = mainCategoryPreferences[a.mainCategory] || 0;
      const bViews = mainCategoryPreferences[b.mainCategory] || 0;
      return bViews - aViews;
    });

    const posts = allPosts.slice(skip, skip + pageSize);
    const totalPosts = allPosts.length;

    res.status(200).json({ posts, totalPosts });
  } catch (err) {
    next(err);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "createdBy",
      "firstName totalPosts totalOffers lastName photo reports createdAt"
    );
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.status(200).json(post);
  } catch (err) {
    if (err.kind === "ObjectId" && err.name === "CastError") {
      return res.status(400).send("Invalid Post ID");
    }
    next(err);
  }
};

exports.getPostsByCurrentUser = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).send("You must be logged in to view your posts");
    }

    const posts = await Post.find({ createdBy: req.session.userId }).populate(
      "createdBy",
      "firstName totalPosts totalOffers lastName photo reports createdAt"
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
