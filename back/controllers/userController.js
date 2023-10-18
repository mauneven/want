const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const mongoose = require("mongoose");
const User = require("../models/user");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50, // 50MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

exports.getCurrentUser = async (req, res, next) => {
  try {
    const User = mongoose.model("User");

    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadPhotoMiddleware = upload.single("photo");

exports.updateCurrentUser = async (req, res, next) => {
  try {
    const User = mongoose.model("User");
    const userId = req.session.userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.phone = req.body.phone;
    user.birthdate = req.body.birthdate;

    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      const newFilename = `${uuidv4()}_${Date.now()}${fileExt}`;
      const newFilePath = path.join(__dirname, "..", "uploads", newFilename);

      // Elimina la foto anterior del servidor si existe
      if (user.photo) {
        const oldFilePath = path.join(__dirname, "..", user.photo);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      await sharp(req.file.path)
        .resize({ width: 300 })
        .jpeg({ quality: 70 })
        .toFile(newFilePath);

      // Elimina el archivo original
      fs.unlinkSync(req.file.path);

      user.photo = `uploads/${newFilename}`;
    }

    await user.save();

    res.status(200).send("User updated successfully");
  } catch (err) {
    next(err);
  }
};

exports.updateUserPreferences = async (req, res, next) => {
  try {
    const { postId, userPreferences } = req.body;
    const userId = req.session.userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    const { mainCategoryPreferences, subCategoryPreferences, thirdCategoryPreferences } = userPreferences;

    const updateCounter = (counter, categories) => {
      if (Array.isArray(categories)) {
        categories.forEach((category) => {
          const [mainCategory, subCategory, thirdCategory] = category.split('.');
          const categoryKey = [mainCategory, subCategory, thirdCategory].filter(Boolean).join('.');

          if (!counter[categoryKey]) {
            counter[categoryKey] = 1;
          } else {
            counter[categoryKey] += 1;
          }
        });
      }
    };    

    updateCounter(user.mainCategoryCounts, mainCategoryPreferences);
    updateCounter(user.subCategoryCounts, subCategoryPreferences);
    updateCounter(user.thirdCategoryCounts, thirdCategoryPreferences);

    user.markModified('mainCategoryCounts');
    user.markModified('subCategoryCounts');
    user.markModified('thirdCategoryCounts');

    await user.save();

    res.status(200).send('User preferences updated successfully');
  } catch (err) {
    next(err);
  }
};

exports.getUserPreferences = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    const preferences = {
      mainCategoryCounts: user.mainCategoryCounts,
      subCategoryCounts: user.subCategoryCounts,
      thirdCategoryCounts: user.thirdCategoryCounts
    };

    res.status(200).json(preferences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};