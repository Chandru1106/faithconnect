const db = require('../config/database');

// Get user notifications
exports.getNotifications = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;

        const result = await db.query(
            `SELECT 
        n.*,
        u.full_name as related_user_name,
        u.profile_photo as related_user_photo
       FROM notifications n
       LEFT JOIN users u ON n.related_user_id = u.id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC
       LIMIT $2 OFFSET $3`,
            [req.user.id, limit, offset]
        );

        res.json({
            success: true,
            data: result.rows.map(notif => ({
                id: notif.id,
                type: notif.type,
                content: notif.content,
                isRead: notif.is_read,
                createdAt: notif.created_at,
                relatedUser: notif.related_user_id ? {
                    id: notif.related_user_id,
                    name: notif.related_user_name,
                    photo: notif.related_user_photo
                } : null,
                relatedPostId: notif.related_post_id,
                relatedReelId: notif.related_reel_id
            }))
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching notifications'
        });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `UPDATE notifications 
       SET is_read = true 
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('Mark notification as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while marking notification as read'
        });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        await db.query(
            'UPDATE notifications SET is_read = true WHERE user_id = $1',
            [req.user.id]
        );

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while marking notifications as read'
        });
    }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
            [req.user.id]
        );

        res.json({
            success: true,
            data: {
                unreadCount: parseInt(result.rows[0].count)
            }
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching unread count'
        });
    }
};
