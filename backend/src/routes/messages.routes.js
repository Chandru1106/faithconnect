const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');
const { authMiddleware } = require('../middleware/auth');

// Send a message
router.post('/', authMiddleware, messagesController.sendMessage);

// Get conversations list
router.get('/conversations', authMiddleware, messagesController.getConversations);

// Get messages with a specific user
router.get('/:userId', authMiddleware, messagesController.getMessages);

// Mark message as read
router.put('/:id/read', authMiddleware, messagesController.markAsRead);

module.exports = router;
