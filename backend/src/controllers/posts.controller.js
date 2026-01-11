const db = require('../config/database');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { caption, mediaType } = req.body;
        const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await db.query(
            `INSERT INTO posts (user_id, caption, media_url, media_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [req.user.id, caption, mediaUrl, mediaType]
        );

        const post = result.rows[0];

        // Create notifications for all followers
        if (req.user.role === 'leader') {
            await db.query(
                `INSERT INTO notifications (user_id, type, content, related_user_id, related_post_id)
         SELECT 
           f.follower_id,
           'post',
           $1 || ' posted: ' || COALESCE($2, 'new content'),
           $3,
           $4
         FROM follows f
         WHERE f.leader_id = $3`,
                [req.user.fullName || 'A leader you follow', caption, req.user.id, post.id]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: {
                id: post.id,
                userId: post.user_id,
                caption: post.caption,
                mediaUrl: post.media_url,
                mediaType: post.media_type,
                likesCount: post.likes_count,
                commentsCount: post.comments_count,
                createdAt: post.created_at
            }
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating post'
        });
    }
};

// Get explore feed (all posts)
exports.getExplorePosts = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;

        const result = await db.query(
            `SELECT 
        p.*,
        u.full_name as author_name,
        u.profile_photo as author_photo,
        u.role as author_role,
        u.faith as author_faith,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
        EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1) as is_liked,
        EXISTS(SELECT 1 FROM saves WHERE post_id = p.id AND user_id = $1) as is_saved
       FROM posts p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
            [req.user?.id || 0, limit, offset]
        );

        res.json({
            success: true,
            data: result.rows.map(post => ({
                id: post.id,
                caption: post.caption,
                mediaUrl: post.media_url,
                mediaType: post.media_type,
                likesCount: parseInt(post.likes_count),
                commentsCount: parseInt(post.comments_count),
                createdAt: post.created_at,
                isLiked: post.is_liked,
                isSaved: post.is_saved,
                author: {
                    id: post.user_id,
                    name: post.author_name,
                    photo: post.author_photo,
                    role: post.author_role,
                    faith: post.author_faith
                }
            }))
        });
    } catch (error) {
        console.error('Get explore posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching posts'
        });
    }
};

// Get following feed (posts from followed leaders)
exports.getFollowingPosts = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;

        const result = await db.query(
            `SELECT 
        p.*,
        u.full_name as author_name,
        u.profile_photo as author_photo,
        u.role as author_role,
        u.faith as author_faith,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
        EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1) as is_liked,
        EXISTS(SELECT 1 FROM saves WHERE post_id = p.id AND user_id = $1) as is_saved
       FROM posts p
       JOIN users u ON p.user_id = u.id
       JOIN follows f ON p.user_id = f.leader_id
       WHERE f.follower_id = $1
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
            [req.user.id, limit, offset]
        );

        res.json({
            success: true,
            data: result.rows.map(post => ({
                id: post.id,
                caption: post.caption,
                mediaUrl: post.media_url,
                mediaType: post.media_type,
                likesCount: parseInt(post.likes_count),
                commentsCount: parseInt(post.comments_count),
                createdAt: post.created_at,
                isLiked: post.is_liked,
                isSaved: post.is_saved,
                author: {
                    id: post.user_id,
                    name: post.author_name,
                    photo: post.author_photo,
                    role: post.author_role,
                    faith: post.author_faith
                }
            }))
        });
    } catch (error) {
        console.error('Get following posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching following posts'
        });
    }
};

// Get user's posts
exports.getUserPosts = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 20, offset = 0 } = req.query;

        const result = await db.query(
            `SELECT 
        p.*,
        u.full_name as author_name,
        u.profile_photo as author_photo,
        u.role as author_role,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
        EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $2) as is_liked,
        EXISTS(SELECT 1 FROM saves WHERE post_id = p.id AND user_id = $2) as is_saved
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC
       LIMIT $3 OFFSET $4`,
            [id, req.user?.id || 0, limit, offset]
        );

        res.json({
            success: true,
            data: result.rows.map(post => ({
                id: post.id,
                caption: post.caption,
                mediaUrl: post.media_url,
                mediaType: post.media_type,
                likesCount: parseInt(post.likes_count),
                commentsCount: parseInt(post.comments_count),
                createdAt: post.created_at,
                isLiked: post.is_liked,
                isSaved: post.is_saved,
                author: {
                    id: post.user_id,
                    name: post.author_name,
                    photo: post.author_photo,
                    role: post.author_role
                }
            }))
        });
    } catch (error) {
        console.error('Get user posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user posts'
        });
    }
};

// Delete post
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if post exists and belongs to user
        const checkResult = await db.query(
            'SELECT user_id FROM posts WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        if (checkResult.rows[0].user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own posts'
            });
        }

        await db.query('DELETE FROM posts WHERE id = $1', [id]);

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting post'
        });
    }
};

// Like/unlike post
exports.toggleLike = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if already liked
        const existingLike = await db.query(
            'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
            [req.user.id, id]
        );

        if (existingLike.rows.length > 0) {
            // Unlike
            await db.query(
                'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
                [req.user.id, id]
            );

            res.json({
                success: true,
                message: 'Post unliked',
                isLiked: false
            });
        } else {
            // Like
            await db.query(
                'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
                [req.user.id, id]
            );

            // Get post author to create notification
            const postResult = await db.query(
                'SELECT user_id FROM posts WHERE id = $1',
                [id]
            );

            if (postResult.rows.length > 0 && postResult.rows[0].user_id !== req.user.id) {
                await db.query(
                    `INSERT INTO notifications (user_id, type, content, related_user_id, related_post_id)
           VALUES ($1, 'like', $2, $3, $4)`,
                    [
                        postResult.rows[0].user_id,
                        'Someone liked your post',
                        req.user.id,
                        id
                    ]
                );
            }

            res.json({
                success: true,
                message: 'Post liked',
                isLiked: true
            });
        }
    } catch (error) {
        console.error('Toggle like error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while toggling like'
        });
    }
};

// Comment on post
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
            `INSERT INTO comments (user_id, post_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [req.user.id, id, content]
        );

        const comment = result.rows[0];

        // Create notification for post author
        const postResult = await db.query(
            'SELECT user_id FROM posts WHERE id = $1',
            [id]
        );

        if (postResult.rows.length > 0 && postResult.rows[0].user_id !== req.user.id) {
            await db.query(
                `INSERT INTO notifications (user_id, type, content, related_user_id, related_post_id)
         VALUES ($1, 'comment', $2, $3, $4)`,
                [
                    postResult.rows[0].user_id,
                    'Someone commented on your post',
                    req.user.id,
                    id
                ]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: {
                id: comment.id,
                content: comment.content,
                createdAt: comment.created_at
            }
        });
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating comment'
        });
    }
};

// Get post comments
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
       WHERE c.post_id = $1
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
        console.error('Get comments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching comments'
        });
    }
};

// Save/unsave post
exports.toggleSave = async (req, res) => {
    try {
        const { id } = req.params;

        const existingSave = await db.query(
            'SELECT id FROM saves WHERE user_id = $1 AND post_id = $2',
            [req.user.id, id]
        );

        if (existingSave.rows.length > 0) {
            await db.query(
                'DELETE FROM saves WHERE user_id = $1 AND post_id = $2',
                [req.user.id, id]
            );

            res.json({
                success: true,
                message: 'Post unsaved',
                isSaved: false
            });
        } else {
            await db.query(
                'INSERT INTO saves (user_id, post_id) VALUES ($1, $2)',
                [req.user.id, id]
            );

            res.json({
                success: true,
                message: 'Post saved',
                isSaved: true
            });
        }
    } catch (error) {
        console.error('Toggle save error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while toggling save'
        });
    }
};
