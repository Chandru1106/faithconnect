-- FaithConnect Database Schema
-- Drop existing tables if they exist
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS saves CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS reels CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('worshiper', 'leader');
CREATE TYPE faith_type AS ENUM ('Christianity', 'Islam', 'Judaism', 'Hinduism', 'Buddhism', 'Other');
CREATE TYPE notification_type AS ENUM ('post', 'reel', 'message', 'like', 'comment', 'follow');

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    faith faith_type,
    bio TEXT,
    profile_photo VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Follows Table (Many-to-Many relationship)
CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    leader_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, leader_id),
    CHECK (follower_id != leader_id)
);

-- Posts Table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    caption TEXT,
    media_url VARCHAR(500),
    media_type VARCHAR(50), -- 'image' or 'video'
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reels Table
CREATE TABLE reels (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    caption TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Likes Table (for both posts and reels)
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    reel_id INTEGER REFERENCES reels(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, reel_id),
    CHECK (
        (post_id IS NOT NULL AND reel_id IS NULL) OR
        (post_id IS NULL AND reel_id IS NOT NULL)
    )
);

-- Comments Table (for both posts and reels)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    reel_id INTEGER REFERENCES reels(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (post_id IS NOT NULL AND reel_id IS NULL) OR
        (post_id IS NULL AND reel_id IS NOT NULL)
    )
);

-- Saves Table (for saving posts/reels)
CREATE TABLE saves (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    reel_id INTEGER REFERENCES reels(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, reel_id),
    CHECK (
        (post_id IS NOT NULL AND reel_id IS NULL) OR
        (post_id IS NULL AND reel_id IS NOT NULL)
    )
);

-- Messages Table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (sender_id != receiver_id)
);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    content TEXT NOT NULL,
    related_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    related_post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    related_reel_id INTEGER REFERENCES reels(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_leader ON follows(leader_id);
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_reels_user ON reels(user_id);
CREATE INDEX idx_reels_created ON reels(created_at DESC);
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_likes_reel ON likes(reel_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_reel ON comments(reel_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Insert sample data for testing
-- Sample Religious Leaders
INSERT INTO users (email, password_hash, full_name, role, faith, bio, profile_photo) VALUES
('leader1@faith.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE8eeoooGgXwOR.9bzNI68kSmIAd.a', 'Pastor John Smith', 'leader', 'Christianity', 'Spreading love and faith through the word of God. 20+ years of ministry experience.', 'https://i.pravatar.cc/300?img=12'),
('leader2@faith.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE8eeoooGgXwOR.9bzNI68kSmIAd.a', 'Imam Ahmed Hassan', 'leader', 'Islam', 'Guiding souls on the path of peace and righteousness. Islamic scholar and community leader.', 'https://i.pravatar.cc/300?img=33'),
('leader3@faith.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE8eeoooGgXwOR.9bzNI68kSmIAd.a', 'Rabbi David Cohen', 'leader', 'Judaism', 'Teaching Torah wisdom and Jewish traditions for modern times.', 'https://i.pravatar.cc/300?img=15');

-- Sample Worshipers
INSERT INTO users (email, password_hash, full_name, role, faith, profile_photo) VALUES
('worshiper1@faith.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE8eeoooGgXwOR.9bzNI68kSmIAd.a', 'Sarah Johnson', 'worshiper', 'Christianity', 'https://i.pravatar.cc/300?img=5'),
('worshiper2@faith.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE8eeoooGgXwOR.9bzNI68kSmIAd.a', 'Michael Brown', 'worshiper', 'Islam', 'https://i.pravatar.cc/300?img=8');

-- Sample Follows
INSERT INTO follows (follower_id, leader_id) VALUES
(4, 1), -- Sarah follows Pastor John
(4, 2), -- Sarah follows Imam Ahmed
(5, 2); -- Michael follows Imam Ahmed

-- Sample Posts
INSERT INTO posts (user_id, caption, media_url, media_type) VALUES
(1, 'Faith can move mountains. Trust in His plan today. 🙏', 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800', 'image'),
(2, 'Remember: Prayer is the key to all doors. Never lose hope.', 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=800', 'image'),
(3, 'Shabbat Shalom! May peace be upon your home this weekend.', 'https://images.unsplash.com/photo-1509021436665-8f4f2c7b8d7f?w=800', 'image');

-- Sample Reels
INSERT INTO reels (user_id, caption, video_url, thumbnail_url) VALUES
(1, 'Daily inspiration: Start your day with gratitude', 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400'),
(2, 'The power of faith in difficult times', 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=400');

-- Sample Likes
INSERT INTO likes (user_id, post_id) VALUES
(4, 1),
(4, 2),
(5, 2);

-- Sample Comments
INSERT INTO comments (user_id, post_id, content) VALUES
(4, 1, 'Amen! This message really touched my heart today.'),
(5, 2, 'Thank you for this reminder. Truly inspiring!');

-- Password for all test accounts: password123
