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
    const {
      title,
      description,
      latitude,
      longitude,
      mainCategory,
      subCategory,
      thirdCategory,
      price,
    } = req.body;
    const photos = req.files.map((file) => ({
      type: file.mimetype,
      path: file.path,
      originalname: file.originalname,
    }));
    let compressedImagePaths = [];

    if (photos.length > 0) {
      compressedImagePaths = await Promise.all(
        photos.map(async (photo) => {
          const compressedImagePath = `uploads/${uuidv4()}.webp`; // Cambiar la extensión a .webp
          await sharp(photo.path)
            .resize({ width: 500 })
            .toFormat('webp') // Convertir a formato WebP
            .toFile(compressedImagePath);
          try {
            await fs.promises.unlink(photo.path);
          } catch (err) {
            console.error(`Error deleting file ${photo.path}: ${err.message}`);
          }
          return compressedImagePath;
        })
      );

      req.files = compressedImagePaths.map((path) => ({ path }));
    }

    // Desplazar las coordenadas dentro de un radio de 5 km
    const newPosition = geolib.computeDestinationPoint(
      { latitude, longitude },
      1000, //  1000 metros
      Math.random() * 360 // Ángulo aleatorio en grados
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
      subCategory,
      thirdCategory,
      price,
      photos: compressedImagePaths || [],
    });
    await post.save();

    // Incrementar contador de totalPosts del usuario
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
      subCategory,
      thirdCategory,
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

    // Desplazar las coordenadas dentro de un radio de 5 km
    const newPosition = geolib.computeDestinationPoint(
      { latitude, longitude },
      1000, // 1000 metros
      Math.random() * 360 // Ángulo aleatorio en grados
    );
    post.latitude = newPosition.latitude;
    post.longitude = newPosition.longitude;

    post.mainCategory = mainCategory;
    post.subCategory = subCategory;
    post.thirdCategory = thirdCategory;
    post.price = price;

    if (req.files.length > 0) {
      const photos = req.files.map((file) => file.path);
      const compressedImagePaths = await Promise.all(
        photos.map(async (photo) => {
          const compressedImagePath = `uploads/${uuidv4()}.webp`; // Cambiar la extensión a .webp
          await sharp(photo).resize({ width: 500 }).toFormat('webp').toFile(compressedImagePath); // Convertir a formato WebP
          try {
            await fs.promises.unlink(photo);
          } catch (err) {
            console.error(`Error deleting file ${photo}: ${err.message}`);
          }
          return compressedImagePath;
        })
      );
      req.files = compressedImagePaths.map((path) => ({ path }));

      // Si hay imágenes eliminadas previamente, también debes eliminarlas en formato WebP
      if (deletedImages) {
        const deletedImagePaths = deletedImages.split(",");
        deletedImagePaths.forEach(async (imagePath) => {
          const parsedUrl = url.parse(imagePath);
          const localPath = parsedUrl.pathname;
          const oldPhotoPath = path.join(__dirname, "..", localPath);
          try {
            await fs.promises.unlink(oldPhotoPath);
          } catch (err) {
            console.error(
              `Error deleting file ${oldPhotoPath}: ${err.message}`
            );
          }
        });
      }

      post.photos = [...post.photos, ...compressedImagePaths];
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

    // Buscar todas las ofertas asociadas con este post
    const offers = await Offer.find({ post: req.params.id });

    // Eliminar las fotos de las ofertas asociadas con este post
    for (const offer of offers) {
      if (offer.photos) {
        for (const photo of offer.photos) {
          // Añade este bucle para iterar sobre el array de fotos
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
    console.log("Post already deleted");
    return;
  }

  // Buscar todas las ofertas asociadas con este post
  const offers = await Offer.find({ post: postId });

  // Eliminar las fotos de las ofertas asociadas con este post
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

  // Eliminar las ofertas y notificaciones relacionadas con el post
  await Offer.deleteMany({ post: postId });
  await Notification.deleteMany({ postId });

  // Eliminar las imágenes del post
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

    // Filtrar por categoría
    if (req.query.mainCategory) {
      filters["mainCategory"] = req.query.mainCategory;
    }
    if (req.query.subCategory) {
      filters["subCategory"] = req.query.subCategory;
    }
    if (req.query.thirdCategory) {
      filters["thirdCategory"] = req.query.thirdCategory;
    }

    // Filtrar por término de búsqueda
    if (req.query.searchTerm) {
      filters["$or"] = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { description: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    const mainCategoryPreferences = JSON.parse(
      req.query.mainCategoryPreferences || "{}"
    );
    const subCategoryPreferences = JSON.parse(
      req.query.subCategoryPreferences || "{}"
    );
    const thirdCategoryPreferences = JSON.parse(
      req.query.thirdCategoryPreferences || "{}"
    );

    console.log("Gustos del usuario:");
    console.log("Main Category Preferences:", mainCategoryPreferences);
    console.log("Sub Category Preferences:", subCategoryPreferences);
    console.log("Third Category Preferences:", thirdCategoryPreferences);

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    // Obtener las subcategorías con más vistas del usuario
    const topSubCategories = Object.keys(subCategoryPreferences)
      .sort((a, b) => subCategoryPreferences[b] - subCategoryPreferences[a]);

    // Verificar si se debe habilitar la lógica de subcategorías con más vistas
    const enableTopSubCategories = (
      !req.query.searchTerm &&
      !req.query.mainCategory &&
      !req.query.subCategory &&
      !req.query.thirdCategory &&
      topSubCategories.length > 0
    );

    let allPosts = [];

    if (enableTopSubCategories) {
      // Obtener los posts con las subcategorías con más vistas
      const topSubCategoryPosts = await Post.find({
        ...filters,
        subCategory: { $in: topSubCategories },
      })
        .populate({
          path: "createdBy",
          select: "firstName totalPosts totalOffers lastName photo createdAt",
          populate: {
            path: "reports",
            select: "_id",
          },
        });

      allPosts.push(...topSubCategoryPosts);

      // Obtener los posts más recientes que no están en las subcategorías con más vistas
      const recentPosts = await Post.find({
        ...filters,
        subCategory: { $nin: topSubCategories },
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "createdBy",
          select: "firstName totalPosts totalOffers lastName photo createdAt",
          populate: {
            path: "reports",
            select: "_id",
          },
        });

      allPosts.push(...recentPosts);
    } else {
      // Obtener todos los posts sin filtrar por distancia
      allPosts = await Post.find(filters)
        .sort({ createdAt: -1 })
        .populate({
          path: "createdBy",
          select: "firstName totalPosts totalOffers lastName photo createdAt",
          populate: {
            path: "reports",
            select: "_id",
          },
        });
    }

    // Filtrar los posts por distancia
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
      const radius = parseFloat(req.query.radius) * 1000; // Convertir a metros

      allPosts = allPosts.filter((post) => {
        if (!isNaN(post.latitude) && !isNaN(post.longitude)) {
          const postLocation = {
            latitude: parseFloat(post.latitude),
            longitude: parseFloat(post.longitude),
          };

          const distance = geolib.getDistance(userLocation, postLocation, 1); // Especificar la precisión decimal para evitar errores

          return distance <= radius;
        }

        return false;
      });
    }

    // Ordenar los posts según los gustos del usuario
    allPosts.sort((a, b) => {
      const aViews = subCategoryPreferences[a.subCategory] || 0;
      const bViews = subCategoryPreferences[b.subCategory] || 0;
      return bViews - aViews;
    });

    // Obtener los posts paginados
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
