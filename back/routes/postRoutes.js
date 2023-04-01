const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router.get('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);
router.post('/posts', postController.uploadPhotoMiddleware, postController.createPost);
router.put('/posts/:id', postController.uploadPhotoMiddleware, postController.updatePost);
router.delete('/posts/:id', postController.deletePost);
router.get('/my-posts', postController.getPostsByCurrentUser);

module.exports = router;
