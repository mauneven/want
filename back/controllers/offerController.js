const Offer = require("../models/offer");
const Post = require("../models/post");
const multer = require("multer");
const path = require("path");
const Notification = require("../models/notification");
const fs = require("fs");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const WebSocket = require("ws");
const { getWss } = require("./webSocket");
const nodemailer = require("nodemailer");

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

exports.createOffer = async (req, res, next) => {
  try {
    const wss = getWss();
    const {
      title,
      description,
      price,
      countryCode,
      phoneNumber,
      contact,
      postId,
    } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    const photos = req.files.map((file) => file.path);
    let compressedImagePaths = [];

    if (req.files.length > 0) {
      const photoDetails = req.files.map((file) => ({
        type: file.mimetype,
        path: file.path,
        originalname: file.originalname,
      }));

      compressedImagePaths = await Promise.all(
        photoDetails.map(async (photo) => {
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

    const offer = new Offer({
      title,
      description,
      price,
      photos: compressedImagePaths || [],
      countryCode,
      phoneNumber,
      contact,
      createdBy: req.session.userId,
      receivedBy: post.createdBy,
      post: postId,
    });

    await offer.save();

    const recipientUser = await User.findById(post.createdBy);
    if (recipientUser) {
      await sendOfferEmail(recipientUser.email, title, description);
    }

    // Define notificationContent after initializing offer
    const notificationContent = `${offer.title}`;

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "NEW_OFFER",
            content: notificationContent,
          })
        );
      }
    });

    // Incrementar contador de totalOffers del usuario
    await User.findByIdAndUpdate(req.session.userId, {
      $inc: { totalOffers: 1 },
    });

    await exports.sendNotification(post.createdBy, notificationContent, postId);
    res.status(201).json(offer);
  } catch (err) {
    next(err);
  }
};

const sendOfferEmail = async (email, title, description) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "wanttests@gmail.com", // Tu dirección de correo
      pass: "hgdxskaqpsunouin", // Tu contraseña
    },
  });

  const mailOptions = {
    from: `Want | You got a new offer "${title}" <wanttests@gmail.com>`,
    to: email,
    subject: `You got a new offer "${title}"`,
    html: `
      <p>You received a new offer on Want:</p>
      <h2>${title}</h2>
      <p>${description}</p>
      <a href="https://want.com.co" style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">View Offer</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Offer email sent");
  } catch (err) {
    console.error("Error sending offer email:", err);
  }
};

exports.getOffersByCurrentUser = async (req, res, next) => {
  try {
    const offers = await Offer.find({ createdBy: req.session.userId })
      .populate("post", "title")
      .populate(
        "createdBy",
        "firstName lastName totalPosts totalOffers photo contact reports createdAt countryCode phoneNumber"
      );
    res.status(200).json(offers);
  } catch (err) {
    next(err);
  }
};

exports.getOffersReceivedByCurrentUser = async (req, res, next) => {
  try {
    const offers = await Offer.find({ receivedBy: req.session.userId })
      .populate("post", "title")
      .populate(
        "createdBy",
        "firstName lastName totalPosts totalOffers photo contact reports createdAt countryCode phoneNumber"
      );
    res.status(200).json(offers);
  } catch (err) {
    next(err);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.session.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

exports.sendNotification = async (recipientId, content, postId) => {
  const notification = new Notification({
    content,
    recipient: recipientId,
    postId,
    type: "offer",
  }); // Añade postId aquí
  await notification.save();
};

exports.deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).send("Offer not found");
    }

    const isOfferCreatedByUser =
      offer.createdBy.toString() === req.session.userId;
    const isOfferReceivedByUser =
      offer.receivedBy.toString() === req.session.userId;
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOfferCreatedByUser && !isOfferReceivedByUser && !isAdmin) {
      return res
        .status(401)
        .send("You are not authorized to delete this offer");
    }

    // Encuentra la notificación correspondiente al offerId de la oferta que se está eliminando.
    const notification = await Notification.findOne({ postId: offer.post });

    // Eliminar las imágenes asociadas con la oferta
    if (offer.photos) {
      offer.photos.forEach((photo) => {
        const imagePath = path.join(__dirname, "..", photo);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error al eliminar la imagen:", err);
          } else {
            console.log("Imagen eliminada:", imagePath);
          }
        });
      });
    }

    await Offer.deleteOne({ _id: req.params.id });

    if (notification) {
      await Notification.deleteOne({ _id: notification._id });
    }

    // Enviar notificación de WebSocket
    const wss = getWss();
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "OFFER_DELETED",
            content: `Offer ${offer._id} has been deleted.`,
          })
        );
      }
    });

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
      return res.status(404).send("Offer not found");
    }

    const report = new Report({
      description,
      createdBy: req.session.userId,
    });

    await report.save();

    offer.reports.push(report);
    await offer.save();

    if (offer.reports.length === 1) {
      // Encuentra la notificación correspondiente al offerId de la oferta que se está eliminando.
      const notification = await Notification.findOne({
        content: `Offer ${offer._id}: "${offer.title}"`,
      });

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

exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).send("Notification not found");
    }

    notification.isRead = true;
    await notification.save();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.markAllNotificationsAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.session.userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
