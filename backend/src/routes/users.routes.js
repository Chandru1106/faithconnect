const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authMiddleware } = require('../middleware/auth');

// Get all leaders
router.get('/leaders', authMiddleware, usersController.getAllLeaders);

// Get user profile by ID
router.get('/:id', authMiddleware, usersController.getUserProfile);

// Update own profile
router.put('/profile', authMiddleware, usersController.updateProfile);

// Get leader's followers
router.get('/:id/followers', authMiddleware, usersController.getLeaderFollowers);

module.exports = router;
