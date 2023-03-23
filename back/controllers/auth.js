const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { firstName, lastName, phoneNumber, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'El correo electrónico ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    req.session.userId = newUser._id; // Iniciar sesión después de crear un nuevo usuario

    return res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al registrar al usuario' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    req.session.userId = user._id;

    res.cookie('connect.sid', req.session.id, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

const logout = (req, res) => {
  console.log("session before destroy", req.session); // nuevo console.log
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid');
    console.log("session after destroy", req.session); // nuevo console.log
    return res.status(200).json({ message: 'Cierre de sesión exitoso' });
  });
};

module.exports = { register, login, logout };
