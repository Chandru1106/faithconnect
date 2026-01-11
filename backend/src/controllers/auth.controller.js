const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// Register new user
exports.register = async (req, res) => {
    try {
        const { email, password, fullName, role, faith, bio, profilePhoto } = req.body;

        // Validate required fields
        if (!email || !password || !fullName || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, password, full name, and role'
            });
        }

        // Validate role
        if (!['worshiper', 'leader'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be either "worshiper" or "leader"'
            });
        }

        // Check if user already exists
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const result = await db.query(
            `INSERT INTO users (email, password_hash, full_name, role, faith, bio, profile_photo)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, full_name, role, faith, bio, profile_photo, created_at`,
            [email, passwordHash, fullName, role, faith || null, bio || null, profilePhoto || null]
        );

        const user = result.rows[0];

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.full_name,
                    role: user.role,
                    faith: user.faith,
                    bio: user.bio,
                    profilePhoto: user.profile_photo,
                    createdAt: user.created_at
                },
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = result.rows[0];

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.full_name,
                    role: user.role,
                    faith: user.faith,
                    bio: user.bio,
                    profilePhoto: user.profile_photo
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// Get current user profile
exports.getMe = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, email, full_name, role, faith, bio, profile_photo, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        res.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                faith: user.faith,
                bio: user.bio,
                profilePhoto: user.profile_photo,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile'
        });
    }
};
