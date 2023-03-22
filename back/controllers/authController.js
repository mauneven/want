const bcrypt = require('bcrypt');
const User = require('../models/userModel');

exports.registerUser = async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword });
      await user.save();
  
      req.session.userId = user._id; // Iniciar sesión automáticamente después del registro
  
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      next(error);
    }
  };

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    req.session.userId = user._id;

    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    next(error);
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Sesión cerrada exitosamente' });
};
