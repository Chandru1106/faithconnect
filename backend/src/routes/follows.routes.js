const express = require('express');
const router = express.Router();
const followsController = require('../controllers/follows.controller');
const { authMiddleware } = require('../middleware/auth');

// Follow a leader
router.post('/:leaderId', authMiddleware, followsController.followLeader);

// Unfollow a leader
router.delete('/:leaderId', authMiddleware, followsController.unfollowLeader);

// Get my followed leaders
router.get('/my-leaders', authMiddleware, followsController.getMyLeaders);

// Check if following a leader
router.get('/check/:leaderId', authMiddleware, followsController.checkFollowing);

module.exports = router;
