const Post = require('../models/postModel');

async function createPost(req, res, next) {
  const { title, description } = req.body;
  const { userId } = req.session;
  try {
    const post = new Post({ title, description, user: userId });
    await post.save();
    res.json({ message: 'Publicación creada con éxito', post });
  } catch (error) {
    next(error);
  }
}

async function getPosts(req, res, next) {
  try {
    const posts = await Post.find().populate('user', 'email');
    res.json({ posts });
  } catch (error) {
    next(error);
  }
}

async function updatePost(req, res, next) {
  const { title, description } = req.body;
  const { postId } = req.params;
  const { userId } = req.session;
  try {
    const post = await Post.findOne({ _id: postId, user: userId });
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    post.title = title;
    post.description = description;
    await post.save();
    res.json({ message: 'Publicación actualizada con éxito', post });
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  const { postId } = req.params;
  const { userId } = req.session;
  try {
    const post = await Post.findOne({ _id: postId, user: userId });
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    await post.remove();
    res.json({ message: 'Publicación eliminada con éxito' });
  } catch (error) {
    next(error);
  }
}

module.exports = { createPost, getPosts, updatePost, deletePost };
