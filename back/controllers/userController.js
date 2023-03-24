const fs = require('fs');
const path = require('path');

const uploadDirectory = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const mongoose = require('mongoose');
const User = require('../models/User');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Selecciona la carpeta de destino donde se guardarán los archivos subidos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Usa el nombre original del archivo como nombre de archivo en el servidor
  }
});

const upload = multer({ storage: storage });

exports.getCurrentUser = async (req, res, next) => {
  try {
    const User = mongoose.model('User');

    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.uploadPhotoMiddleware = upload.single('photo');

exports.updateCurrentUser = async (req, res, next) => {
  try {
    const User = mongoose.model('User');
    const userId = req.session.userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.phone = req.body.phone;
    user.birthdate = req.body.birthdate;

    if (req.file) {
      if (user.photo) {
        // Elimina la foto anterior si existe
        fs.unlink(user.photo, (err) => {
          if (err) {
            console.error('Error removing old profile picture:', err);
          }
        });
      }
      // Guarda la URL de la nueva foto en la base de datos
      user.photo = req.file.path;
    }

    await user.save();

    res.status(200).send('User updated successfully');
  } catch (err) {
    next(err);
  }
};
