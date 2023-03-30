const cron = require('node-cron');
const Post = require('./models/post');
const fs = require('fs');
const path = require('path');

// Ejecuta la tarea cada día a las 00:00
cron.schedule('*/5 * * * * *', async () => {
  const currentTime = new Date();

  // Encuentra los posts que han expirado
  const expiredPosts = await Post.find({
    expireAt: { $lt: currentTime },
  });

  // Elimina las fotos asociadas a los posts expirados
  expiredPosts.forEach((post) => {
    if (post.photo) {
      fs.unlink(path.join(__dirname, post.photo), (err) => {
        if (err) {
          console.error('Error al eliminar la foto:', err);
        }
      });
    }
  });
});