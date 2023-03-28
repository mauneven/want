const User = require('../models/User');

exports.getCurrentUser = async (req, res, next) => {
    try {
      if (!req.session.userId) {
        return res.status(200).json({}); // Devuelve un objeto vacío si no hay sesión de usuario
      }
  
      const user = await User.findById(req.session.userId).select('_id role');
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };  