const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/post');
const User = require('../models/user');

const router = express.Router();

// Obtener todas las publicaciones
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'firstName lastName avatar');
    return res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al obtener las publicaciones' });
  }
});

// Obtener una publicación por ID
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate('author', 'firstName lastName avatar');
    if (!post) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    return res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al obtener la publicación' });
  }
});

// Crear una publicación
router.post('/', [
  body('title').notEmpty().withMessage('El título es obligatorio'),
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { title, description } = req.body;
  const { userId } = req.session;

  try {
    const author = await User.findById(userId);
    if (!author) {
      return res.status(401).json({ error: 'Debe iniciar sesión para crear una publicación' });
    }

    const newPost = new Post({ title, description, author });

    await newPost.save();

    return res.status(201).json({ message: 'Publicación creada con éxito', post: newPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al crear la publicación' });
  }
});

// Actualizar una publicación
router.put('/:postId', [
  body('title').notEmpty().withMessage('El título es obligatorio'),
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { postId } = req.params;
  const { title, description } = req.body;
  const { userId } = req.session;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    if (!post.canBeEditedBy(User.findById(userId))) {
        return res.status(403).json({ error: 'No tienes permiso para editar esta publicación' });
      }
  
      post.title = title;
      post.description = description;
  
      await post.save();
  
      return res.status(200).json({ message: 'Publicación actualizada con éxito', post });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error al actualizar la publicación' });
    }
  });
  
  // Eliminar una publicación
  router.delete('/:postId', async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.session;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Publicación no encontrada' });
      }
  
      if (!post.canBeEditedBy(User.findById(userId))) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar esta publicación' });
      }
  
      await post.remove();
  
      return res.status(200).json({ message: 'Publicación eliminada con éxito' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error al eliminar la publicación' });
    }
  });
  
  module.exports = router;
  
   
