const db = require('../config/database');

// Get all leaders
exports.getAllLeaders = async (req, res) => {
    try {
        const { faith } = req.query;

        let query = `
      SELECT 
        u.id, u.full_name, u.role, u.faith, u.bio, u.profile_photo,
        COUNT(DISTINCT f.follower_id) as followers_count
      FROM users u
      LEFT JOIN follows f ON u.id = f.leader_id
      WHERE u.role = 'leader'
    `;

        const params = [];

        if (faith) {
            query += ` AND u.faith = $1`;
            params.push(faith);
        }

        query += `
      GROUP BY u.id
      ORDER BY followers_count DESC, u.created_at DESC
    `;

        const result = await db.query(query, params);

        res.json({
            success: true,
            data: result.rows.map(leader => ({
                id: leader.id,
                fullName: leader.full_name,
                role: leader.role,
                faith: leader.faith,
                bio: leader.bio,
                profilePhoto: leader.profile_photo,
                followersCount: parseInt(leader.followers_count)
            }))
        });
    } catch (error) {
        console.error('Get leaders error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching leaders'
        });
    }
};

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT 
        u.id, u.full_name, u.role, u.faith, u.bio, u.profile_photo, u.created_at,
        COUNT(DISTINCT f.follower_id) as followers_count,
        COUNT(DISTINCT p.id) as posts_count
      FROM users u
      LEFT JOIN follows f ON u.id = f.leader_id
      LEFT JOIN posts p ON u.id = p.user_id
      WHERE u.id = $1
      GROUP BY u.id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        // Check if current user is following this leader
        let isFollowing = false;
        if (req.user && user.role === 'leader') {
            const followCheck = await db.query(
                'SELECT id FROM follows WHERE follower_id = $1 AND leader_id = $2',
                [req.user.id, id]
            );
            isFollowing = followCheck.rows.length > 0;
        }

        res.json({
            success: true,
            data: {
                id: user.id,
                fullName: user.full_name,
                role: user.role,
                faith: user.faith,
                bio: user.bio,
                profilePhoto: user.profile_photo,
                createdAt: user.created_at,
                followersCount: parseInt(user.followers_count),
                postsCount: parseInt(user.posts_count),
                isFollowing
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user profile'
        });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, faith, bio, profilePhoto } = req.body;

        const result = await db.query(
            `UPDATE users 
       SET full_name = COALESCE($1, full_name),
           faith = COALESCE($2, faith),
           bio = COALESCE($3, bio),
           profile_photo = COALESCE($4, profile_photo),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, email, full_name, role, faith, bio, profile_photo`,
            [fullName, faith, bio, profilePhoto, req.user.id]
        );

        const user = result.rows[0];

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                faith: user.faith,
                bio: user.bio,
                profilePhoto: user.profile_photo
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating profile'
        });
    }
};

// Get leader's followers
exports.getLeaderFollowers = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT 
        u.id, u.full_name, u.profile_photo, u.faith, f.created_at as followed_at
       FROM follows f
       JOIN users u ON f.follower_id = u.id
       WHERE f.leader_id = $1
       ORDER BY f.created_at DESC`,
            [id]
        );

        res.json({
            success: true,
            data: result.rows.map(follower => ({
                id: follower.id,
                fullName: follower.full_name,
                profilePhoto: follower.profile_photo,
                faith: follower.faith,
                followedAt: follower.followed_at
            }))
        });
    } catch (error) {
        console.error('Get followers error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching followers'
        });
    }
};
