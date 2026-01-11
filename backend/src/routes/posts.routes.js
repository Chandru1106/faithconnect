const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const { authMiddleware, isLeader } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create post (leaders only)
router.post('/', authMiddleware, isLeader, upload.single('media'), postsController.createPost);

// Get explore feed
router.get('/explore', authMiddleware, postsController.getExplorePosts);

// Get following feed
router.get('/following', authMiddleware, postsController.getFollowingPosts);

// Get user's posts
router.get('/user/:id', authMiddleware, postsController.getUserPosts);

// Delete post
router.delete('/:id', authMiddleware, postsController.deletePost);

// Like/unlike post
router.post('/:id/like', authMiddleware, postsController.toggleLike);

// Comment on post
router.post('/:id/comment', authMiddleware, postsController.createComment);

// Get post comments
router.get('/:id/comments', authMiddleware, postsController.getComments);

// Save/unsave post
router.post('/:id/save', authMiddleware, postsController.toggleSave);

module.exports = router;
