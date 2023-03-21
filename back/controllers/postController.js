// controllers/postController.js
const Post = require('../models/Post');

const createPost = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.userId;

  try {
    const post = new Post({ title, description, user: userId });
    await post.save();

    res.status(201).json({ message: 'Post creado exitosamente', post });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear post', error });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username');
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener posts', error });
  }
};

const getPostById = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId).populate('user', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener post', error });
  }
};

const updatePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.userId;
  const { title, description } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para editar este post' });
    }

    post.title = title;
    post.description = description;
    await post.save();

    res.status(200).json({ message: 'Post actualizado exitosamente', post });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar post', error });
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

        if (post.user.toString() !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este post' });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar post', error });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};