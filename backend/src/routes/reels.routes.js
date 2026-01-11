const express = require('express');
const router = express.Router();
const reelsController = require('../controllers/reels.controller');
const { authMiddleware, isLeader } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create reel (leaders only)
router.post('/', authMiddleware, isLeader, upload.single('video'), reelsController.createReel);

// Get all reels
router.get('/', authMiddleware, reelsController.getAllReels);

// Get user's reels
router.get('/user/:id', authMiddleware, reelsController.getUserReels);

// Like/unlike reel
router.post('/:id/like', authMiddleware, reelsController.toggleLike);

// Comment on reel
router.post('/:id/comment', authMiddleware, reelsController.createComment);

// Get reel comments
router.get('/:id/comments', authMiddleware, reelsController.getComments);

// Save/unsave reel
router.post('/:id/save', authMiddleware, reelsController.toggleSave);

module.exports = router;
