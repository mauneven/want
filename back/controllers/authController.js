const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const postController = require("./postController");
const db = require("../config/database");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { promisify } = require("util");
const Notification = require("../models/notification");
const Post = require("../models/post");
const Offer = require("../models/offer");

exports.register = async (req, res, next) => {
  try {
    const User = mongoose.model("User");

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      birthdate,
      verificationCode,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).send("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      birthdate,
    });

    // Generate verification token
    const token = generateVerificationCode(); // Generate a random 6-digit verification code

    // Encrypt verification code
    const encryptedToken = await bcrypt.hash(token, salt);

    // Assign encrypted verification code and expiration time to the user
    user.verificationCode = encryptedToken;
    user.verificationCodeExpires = Date.now() + 1800000; // Verification code expires in 30 minutes

    await user.save();

    // Send verification email
    await sendVerificationEmail(email, token);

    // Store user data in session
    req.session.userId = user._id;

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User with that email does not exist");
    }

    // Verificar si el usuario ya está verificado
    if (user.isVerified) {
      return res.status(400).send("User is already verified");
    }

    // Generar un nuevo código de verificación
    const code = generateVerificationCode();

    // Generar una nueva salt
    const salt = await bcrypt.genSalt(10);  // Crear una nueva salt aquí

    // Encriptar el nuevo código de verificación
    const encryptedCode = await bcrypt.hash(code, salt);

    // Almacenar el nuevo código de verificación encriptado y el tiempo de expiración en el documento del usuario
    user.verificationCode = encryptedCode;
    user.verificationCodeExpires = Date.now() + 1800000; // Establecer un nuevo tiempo de expiración
    await user.save();

    // Enviar el correo electrónico de verificación con el nuevo código
    await sendVerificationEmail(email, code);

    res.status(200).send("Verification code resent");
  } catch (err) {
    next(err);
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const { verificationCode } = req.body;

    // Check if verificationCode is provided
    if (!verificationCode) {
      return res.status(400).send("Verification code is required");
    }

    const user = await User.findOne({
      verificationCodeExpires: { $gt: Date.now() },
    });
  
    // Asegúrate de que el código de verificación y el código encriptado del usuario sean cadenas
    const verificationCodeStr = String(verificationCode); // Convertir a cadena si es necesario
    const userVerificationCodeStr = String(user.verificationCode); // Convertir a cadena si es necesario


    // Turn bcrypt.compare into a function that returns a promise
    const compareAsync = promisify(bcrypt.compare);
  
    // Compara el código de verificación con el código almacenado
    const isCodeValid = await compareAsync(
      verificationCodeStr,
      userVerificationCodeStr
    );
    
    // Check if a user with a valid verificationCodeExpires is found
    if (!user) {
      return res.status(400).send("Invalid verification code");
    }

    if (!isCodeValid) {
      return res.status(400).send("Invalid verification code");
    }

    if (user.verificationCodeExpires <= Date.now()) {
      return res.status(410).send("Expired verification code");
    }

    if (user.isVerified) {
      return res.status(409).send("Already verified");
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.status(200).send("User successfully verified");
  } catch (err) {
    next(err);
  }
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit verification code
};

const sendVerificationEmail = async (email, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "wanttests@gmail.com",
      pass: "hgdxskaqpsunouin",
    },
  });

  const mailOptions = {
    from: `Want code ${verificationCode} | Verification <wanttests@gmail.com>`,
    to: email,
    subject: "Verify Your Account",
    html: `
    <p>You are one step away from verifying your account on Want. If you want to proceed, enter the following verification code:</p>
    <h2>${verificationCode}</h2>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent");
  } catch (err) {
    console.error("Error sending verification email:", err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const User = mongoose.model("User");

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("Invalid email or password");
    }

    // Store user data in session
    req.session.userId = user._id;

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.isLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.session) {
      await req.session.destroy();
      res.clearCookie("connect.sid");
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.sendResetPasswordEmail = async ({ email, token }) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "wanttests@gmail.com",
      pass: "hgdxskaqpsunouin",
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "Want | Security <wanttests@gmail.com>", // sender address
    to: email, // list of receivers
    subject: "Reset Your Password", // Subject line
    html: `
    <p>You have requested to reset your password on Want. You can do so by following the link below:</p>
    <a href="https://want.com.co/recoveryPassword/${token}">Reset Password</a>
    <p>If you did not request a password reset, please ignore this email and your password will not be changed.</p>
  `,
  });

  //console.log('Message sent: %s', info.messageId);
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User with that email does not exist");
    }

    // Generate reset password token
    const token = await (
      await bcrypt.hash(Date.now().toString(), 10)
    ).replace(/\//g, "n");

    // Store reset password token and expiration date in user document
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1800000; // 30 minutes from now
    await user.save();

    // Send password reset email
    await this.sendResetPasswordEmail({ email, token });

    res.status(200).send("Password reset email sent");
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by reset password token and check if token is not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).send("Invalid or expired password reset token");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password and remove reset password token and expiration date
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send("Password successfully reset");
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const User = mongoose.model("User");
    const { currentPassword, newPassword } = req.body;

    // Get the user from the session
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    // Check if the current password is correct
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).send("Incorrect current password");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).send("Password successfully changed");
  } catch (err) {
    next(err);
  }
};

exports.checkLoggedIn = (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ loggedIn: true, userId: req.session.userId });
  } else {
    res.status(200).json({ loggedIn: false });
  }
};

exports.checkBlocked = async (req, res) => {
  try {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      if (user) {
        if (user.isBlocked) {
          res.status(403).json({ error: "User is blocked" });
        } else {
          res.status(200).json({ message: "User is not blocked" });
        }
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

exports.checkVerified = async (req, res) => {
  try {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      if (user) {
        if (user.isVerified) {
          res.status(200).json({ message: "User is verified" });
        } else {
          res.status(403).json({ error: "User is not verified" });
        }
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

exports.isUserVerified = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return false;
    }

    return user.isVerified;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const deleteUserData = async (userId) => {
  // Buscar al usuario por el ID
  const user = await User.findById(userId);
  if (!user) {
    console.error(`Error: User not found with ID ${userId}`);
    return;
  }

  // Eliminar las fotos de los posts del usuario
  const posts = await Post.find({ createdBy: userId });
  for (const post of posts) {
    if (post.photos) {
      for (const photo of post.photos) {
        if (typeof photo === "string") {
          try {
            const imagePath = path.join(__dirname, "..", photo);
            fs.unlinkSync(imagePath);
          } catch (err) {
            console.error(
              `Error deleting image for post ${post._id}: ${err.message}`
            );
          }
        }
      }
    }
  }

  // Eliminar las fotos de las ofertas creadas por el usuario
  const offers = await Offer.find({ createdBy: userId });
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

  // Eliminar la foto del perfil del usuario
  if (user.photo) {
    try {
      const imagePath = path.join(__dirname, "..", user.photo);
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.error(
        `Error deleting profile image for user ${user._id}: ${err.message}`
      );
    }
  }

  // Eliminar las notificaciones del usuario
  await Notification.deleteMany({ recipient: userId });

  // Eliminar los posts y ofertas del usuario
  await Post.deleteMany({ createdBy: userId });
  await Offer.deleteMany({ createdBy: userId });

  // Finalmente, eliminar al usuario
  await User.deleteOne({ _id: userId });
};

const deleteProfilePhoto = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      console.error(`Error: User not found with ID ${userId}`);
      return;
    }

    // Eliminar la foto del perfil del usuario
    if (user.photo) {
      try {
        const imagePath = path.join(__dirname, "..", user.photo);
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error(
          `Error deleting profile image for user ${user._id}: ${err.message}`
        );
      }
    }
  } catch (err) {
    console.error(`Error deleting profile photo for user ${userId}:`, err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Marcar la cuenta como pendiente de eliminación
    user.isDeleted = true;
    user.putUpForElimination = Date.now();
    await user.save();

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.deletionPass = async (userId) => {
  try {
    await deleteUserData(userId);
    await deleteProfilePhoto(userId);

    // Eliminar al usuario
    await User.deleteOne({ _id: userId });

    console.log("Deletion process completed");
  } catch (err) {
    console.error("Error deleting user data:", err);
  }
};

exports.checkPendingDeletion = async (req, res) => {
  try {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      if (user && user.isDeleted) {
        res.status(200).json({ pendingDeletion: true });
      } else {
        res.status(200).json({ pendingDeletion: false });
      }
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelDeletionProcess = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.isDeleted = false;
    user.putUpForElimination = undefined;
    await user.save();

    res.status(200).send("Deletion process cancelled");
  } catch (err) {
    next(err);
  }
};
