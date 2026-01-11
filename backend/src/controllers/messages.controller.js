const db = require('../config/database');

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Message content is required'
            });
        }

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: 'Receiver ID is required'
            });
        }

        // Check if receiver exists
        const receiverCheck = await db.query(
            'SELECT id, role FROM users WHERE id = $1',
            [receiverId]
        );

        if (receiverCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Receiver not found'
            });
        }

        // Worshipers can only message leaders they follow
        if (req.user.role === 'worshiper') {
            if (receiverCheck.rows[0].role !== 'leader') {
                return res.status(403).json({
                    success: false,
                    message: 'Worshipers can only message religious leaders'
                });
            }

            const followCheck = await db.query(
                'SELECT id FROM follows WHERE follower_id = $1 AND leader_id = $2',
                [req.user.id, receiverId]
            );

            if (followCheck.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'You must follow this leader to send messages'
                });
            }
        }

        // Insert message
        const result = await db.query(
            `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [req.user.id, receiverId, content]
        );

        const message = result.rows[0];

        // Create notification for receiver
        await db.query(
            `INSERT INTO notifications (user_id, type, content, related_user_id)
       VALUES ($1, 'message', 'sent you a message', $2)`,
            [receiverId, req.user.id]
        );

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: {
                id: message.id,
                senderId: message.sender_id,
                receiverId: message.receiver_id,
                content: message.content,
                isRead: message.is_read,
                createdAt: message.created_at
            }
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while sending message'
        });
    }
};

// Get conversations list
exports.getConversations = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT DISTINCT ON (other_user_id)
        other_user_id,
        u.full_name as other_user_name,
        u.profile_photo as other_user_photo,
        u.role as other_user_role,
        last_message,
        last_message_time,
        unread_count
       FROM (
         SELECT 
           CASE 
             WHEN sender_id = $1 THEN receiver_id 
             ELSE sender_id 
           END as other_user_id,
           content as last_message,
           created_at as last_message_time,
           (SELECT COUNT(*) FROM messages 
            WHERE sender_id = CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END
            AND receiver_id = $1 AND is_read = false) as unread_count
         FROM messages
         WHERE sender_id = $1 OR receiver_id = $1
         ORDER BY created_at DESC
       ) conversations
       JOIN users u ON conversations.other_user_id = u.id
       ORDER BY other_user_id, last_message_time DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: result.rows.map(conv => ({
                userId: conv.other_user_id,
                userName: conv.other_user_name,
                userPhoto: conv.other_user_photo,
                userRole: conv.other_user_role,
                lastMessage: conv.last_message,
                lastMessageTime: conv.last_message_time,
                unreadCount: parseInt(conv.unread_count)
            }))
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching conversations'
        });
    }
};

// Get messages with a specific user
exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50, offset = 0 } = req.query;

        const result = await db.query(
            `SELECT 
        m.*,
        sender.full_name as sender_name,
        sender.profile_photo as sender_photo,
        receiver.full_name as receiver_name,
        receiver.profile_photo as receiver_photo
       FROM messages m
       JOIN users sender ON m.sender_id = sender.id
       JOIN users receiver ON m.receiver_id = receiver.id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2) 
          OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at DESC
       LIMIT $3 OFFSET $4`,
            [req.user.id, userId, limit, offset]
        );

        // Mark messages as read
        await db.query(
            `UPDATE messages 
       SET is_read = true 
       WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false`,
            [req.user.id, userId]
        );

        res.json({
            success: true,
            data: result.rows.map(msg => ({
                id: msg.id,
                content: msg.content,
                isRead: msg.is_read,
                createdAt: msg.created_at,
                sender: {
                    id: msg.sender_id,
                    name: msg.sender_name,
                    photo: msg.sender_photo
                },
                receiver: {
                    id: msg.receiver_id,
                    name: msg.receiver_name,
                    photo: msg.receiver_photo
                },
                isMine: msg.sender_id === req.user.id
            })).reverse() // Reverse to show oldest first
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching messages'
        });
    }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `UPDATE messages 
       SET is_read = true 
       WHERE id = $1 AND receiver_id = $2
       RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found or you are not the receiver'
            });
        }

        res.json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while marking message as read'
        });
    }
};
