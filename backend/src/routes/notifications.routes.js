const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const { authMiddleware } = require('../middleware/auth');

// Get notifications
router.get('/', authMiddleware, notificationsController.getNotifications);

// Get unread count
router.get('/unread-count', authMiddleware, notificationsController.getUnreadCount);

// Mark notification as read
router.put('/:id/read', authMiddleware, notificationsController.markAsRead);

// Mark all as read
router.put('/read-all', authMiddleware, notificationsController.markAllAsRead);

module.exports = router;
