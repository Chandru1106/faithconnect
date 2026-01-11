const db = require('../config/database');

// Create a new reel
exports.createReel = async (req, res) => {
    try {
        const { caption } = req.body;
        const videoUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!videoUrl) {
            return res.status(400).json({
                success: false,
                message: 'Video file is required for reels'
            });
        }

        const result = await db.query(
            `INSERT INTO reels (user_id, caption, video_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [req.user.id, caption, videoUrl]
        );

        const reel = result.rows[0];

        // Create notifications for followers
        if (req.user.role === 'leader') {
            await db.query(
                `INSERT INTO notifications (user_id, type, content, related_user_id, related_reel_id)
         SELECT 
           f.follower_id,
           'reel',
           'posted a new reel',
           $1,
           $2
         FROM follows f
         WHERE f.leader_id = $1`,
                [req.user.id, reel.id]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Reel created successfully',
            data: {
                id: reel.id,
                userId: reel.user_id,
                caption: reel.caption,
                videoUrl: reel.video_url,
                likesCount: reel.likes_count,
                commentsCount: reel.comments_count,
                viewsCount: reel.views_count,
                createdAt: reel.created_at
            }
        });
    } catch (error) {
        console.error('Create reel error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating reel'
        });
    }
};

// Get all reels
exports.getAllReels = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;

        const result = await db.query(
            `SELECT 
        r.*,
        u.full_name as author_name,
        u.profile_photo as author_photo,
        u.role as author_role,
        u.faith as author_faith,
        (SELECT COUNT(*) FROM likes WHERE reel_id = r.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE reel_id = r.id) as comments_count,
        EXISTS(SELECT 1 FROM likes WHERE reel_id = r.id AND user_id = $1) as is_liked,
        EXISTS(SELECT 1 FROM saves WHERE reel_id = r.id AND user_id = $1) as is_saved
       FROM reels r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
            [req.user?.id || 0, limit, offset]
        );

        res.json({
            success: true,
            data: result.rows.map(reel => ({
                id: reel.id,
                caption: reel.caption,
                videoUrl: reel.video_url,
                thumbnailUrl: reel.thumbnail_url,
                likesCount: parseInt(reel.likes_count),
                commentsCount: parseInt(reel.comments_count),
                viewsCount: reel.views_count,
                createdAt: reel.created_at,
                isLiked: reel.is_liked,
                isSaved: reel.is_saved,
                author: {
                    id: reel.user_id,
                    name: reel.author_name,
                    photo: reel.author_photo,
                    role: reel.author_role,
                    faith: reel.author_faith
                }
            }))
        });
    } catch (error) {
        console.error('Get reels error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching reels'
        });
    }
};

// Get user's reels
exports.getUserReels = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT 
        r.*,
        u.full_name as author_name,
        u.profile_photo as author_photo,
        (SELECT COUNT(*) FROM likes WHERE reel_id = r.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE reel_id = r.id) as comments_count,
        EXISTS(SELECT 1 FROM likes WHERE reel_id = r.id AND user_id = $2) as is_liked,
        EXISTS(SELECT 1 FROM saves WHERE reel_id = r.id AND user_id = $2) as is_saved
       FROM reels r
       JOIN users u ON r.user_id = u.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
            [id, req.user?.id || 0]
        );

        res.json({
            success: true,
            data: result.rows.map(reel => ({
                id: reel.id,
                caption: reel.caption,
                videoUrl: reel.video_url,
                thumbnailUrl: reel.thumbnail_url,
                likesCount: parseInt(reel.likes_count),
                commentsCount: parseInt(reel.comments_count),
                viewsCount: reel.views_count,
                createdAt: reel.created_at,
                isLiked: reel.is_liked,
                isSaved: reel.is_saved,
                author: {
                    id: reel.user_id,
                    name: reel.author_name,
                    photo: reel.author_photo
                }
            }))
        });
    } catch (error) {
        console.error('Get user reels error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user reels'
        });
    }
};

// Like/unlike reel
exports.toggleLike = async (req, res) => {
    try {
        const { id } = req.params;

        const existingLike = await db.query(
            'SELECT id FROM likes WHERE user_id = $1 AND reel_id = $2',
            [req.user.id, id]
        );

        if (existingLike.rows.length > 0) {
            await db.query(
                'DELETE FROM likes WHERE user_id = $1 AND reel_id = $2',
                [req.user.id, id]
            );

            res.json({
                success: true,
                message: 'Reel unliked',
                isLiked: false
            });
        } else {
            await db.query(
                'INSERT INTO likes (user_id, reel_id) VALUES ($1, $2)',
                [req.user.id, id]
            );

            res.json({
                success: true,
                message: 'Reel liked',
                isLiked: true
            });
        }
    } catch (error) {
        console.error('Toggle reel like error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while toggling like'
        });
    }
};

// Comment on reel
exports.createComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            });
        }

        const result = await db.query(
            `INSERT INTO comments (user_id, reel_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [req.user.id, id, content]
        );

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: {
                id: result.rows[0].id,
                content: result.rows[0].content,
                createdAt: result.rows[0].created_at
            }
        });
    } catch (error) {
        console.error('Create reel comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating comment'
        });
    }
};

// Get reel comments
exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT 
        c.*,
        u.full_name as author_name,
        u.profile_photo as author_photo
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.reel_id = $1
       ORDER BY c.created_at DESC`,
            [id]
        );

        res.json({
            success: true,
            data: result.rows.map(comment => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.created_at,
                author: {
                    id: comment.user_id,
                    name: comment.author_name,
                    photo: comment.author_photo
                }
            }))
        });
    } catch (error) {
        console.error('Get reel comments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching comments'
        });
    }
};

// Save/unsave reel
exports.toggleSave = async (req, res) => {
    try {
        const { id } = req.params;

        const existingSave = await db.query(
            'SELECT id FROM saves WHERE user_id = $1 AND reel_id = $2',
            [req.user.id, id]
        );

        if (existingSave.rows.length > 0) {
            await db.query(
                'DELETE FROM saves WHERE user_id = $1 AND reel_id = $2',
                [req.user.id, id]
            );

            res.json({
                success: true,
                message: 'Reel unsaved',
                isSaved: false
            });
        } else {
            await db.query(
                'INSERT INTO saves (user_id, reel_id) VALUES ($1, $2)',
                [req.user.id, id]
            );

            res.json({
                success: true,
                message: 'Reel saved',
                isSaved: true
            });
        }
    } catch (error) {
        console.error('Toggle reel save error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while toggling save'
        });
    }
};
