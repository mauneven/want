const express = require('express');
const router = express.Router();
const { createPost, getPosts, updatePost, deletePost } = require('../controllers/postController');

router.post('/posts', createPost);
router.get('/posts', getPosts);
router.put('/posts/:postId', updatePost);
router.delete('/posts/:postId', deletePost);

module.exports = router;