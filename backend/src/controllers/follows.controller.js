const db = require('../config/database');

// Follow a leader
exports.followLeader = async (req, res) => {
    try {
        const { leaderId } = req.params;

        // Check if leader exists and is actually a leader
        const leaderCheck = await db.query(
            'SELECT id, role FROM users WHERE id = $1',
            [leaderId]
        );

        if (leaderCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Leader not found'
            });
        }

        if (leaderCheck.rows[0].role !== 'leader') {
            return res.status(400).json({
                success: false,
                message: 'You can only follow religious leaders'
            });
        }

        if (parseInt(leaderId) === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot follow yourself'
            });
        }

        // Check if already following
        const existingFollow = await db.query(
            'SELECT id FROM follows WHERE follower_id = $1 AND leader_id = $2',
            [req.user.id, leaderId]
        );

        if (existingFollow.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You are already following this leader'
            });
        }

        // Create follow relationship
        await db.query(
            'INSERT INTO follows (follower_id, leader_id) VALUES ($1, $2)',
            [req.user.id, leaderId]
        );

        // Create notification for the leader
        await db.query(
            `INSERT INTO notifications (user_id, type, content, related_user_id)
       VALUES ($1, 'follow', 'started following you', $2)`,
            [leaderId, req.user.id]
        );

        res.status(201).json({
            success: true,
            message: 'Successfully followed leader'
        });
    } catch (error) {
        console.error('Follow leader error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while following leader'
        });
    }
};

// Unfollow a leader
exports.unfollowLeader = async (req, res) => {
    try {
        const { leaderId } = req.params;

        const result = await db.query(
            'DELETE FROM follows WHERE follower_id = $1 AND leader_id = $2 RETURNING id',
            [req.user.id, leaderId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'You are not following this leader'
            });
        }

        res.json({
            success: true,
            message: 'Successfully unfollowed leader'
        });
    } catch (error) {
        console.error('Unfollow leader error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while unfollowing leader'
        });
    }
};

// Get my followed leaders
exports.getMyLeaders = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
        u.id, u.full_name, u.profile_photo, u.role, u.faith, u.bio,
        f.created_at as followed_at,
        COUNT(DISTINCT p.id) as posts_count
       FROM follows f
       JOIN users u ON f.leader_id = u.id
       LEFT JOIN posts p ON u.id = p.user_id
       WHERE f.follower_id = $1
       GROUP BY u.id, f.created_at
       ORDER BY f.created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: result.rows.map(leader => ({
                id: leader.id,
                fullName: leader.full_name,
                profilePhoto: leader.profile_photo,
                role: leader.role,
                faith: leader.faith,
                bio: leader.bio,
                followedAt: leader.followed_at,
                postsCount: parseInt(leader.posts_count)
            }))
        });
    } catch (error) {
        console.error('Get my leaders error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching followed leaders'
        });
    }
};

// Check if following a leader
exports.checkFollowing = async (req, res) => {
    try {
        const { leaderId } = req.params;

        const result = await db.query(
            'SELECT id FROM follows WHERE follower_id = $1 AND leader_id = $2',
            [req.user.id, leaderId]
        );

        res.json({
            success: true,
            data: {
                isFollowing: result.rows.length > 0
            }
        });
    } catch (error) {
        console.error('Check following error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while checking follow status'
        });
    }
};
