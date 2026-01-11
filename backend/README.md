# FaithConnect Backend

Backend API for FaithConnect - Connecting Worshipers with Religious Leaders

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup

#### Install PostgreSQL
Make sure PostgreSQL is installed on your system.

#### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE faithconnect;

# Exit
\q
```

#### Run Schema
```bash
psql -U postgres -d faithconnect -f database.sql
```

This will:
- Create all necessary tables
- Set up relationships and indexes
- Insert sample data for testing

### 3. Environment Configuration

Copy `.env.example` to `.env` and update with your credentials:

```env
DB_PASSWORD=your_postgres_password
```

### 4. Start Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users/leaders` - Get all religious leaders
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id/followers` - Get leader's followers

### Posts
- `POST /api/posts` - Create post (leaders only)
- `GET /api/posts/explore` - Get explore feed
- `GET /api/posts/following` - Get following feed
- `GET /api/posts/user/:id` - Get user's posts
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Comment on post
- `GET /api/posts/:id/comments` - Get comments
- `POST /api/posts/:id/save` - Save/unsave post

### Reels
- `POST /api/reels` - Create reel (leaders only)
- `GET /api/reels` - Get all reels
- `GET /api/reels/user/:id` - Get user's reels
- `POST /api/reels/:id/like` - Like/unlike reel
- `POST /api/reels/:id/comment` - Comment on reel
- `GET /api/reels/:id/comments` - Get comments
- `POST /api/reels/:id/save` - Save/unsave reel

### Follows
- `POST /api/follows/:leaderId` - Follow leader
- `DELETE /api/follows/:leaderId` - Unfollow leader
- `GET /api/follows/my-leaders` - Get followed leaders
- `GET /api/follows/check/:leaderId` - Check follow status

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId` - Get messages with user
- `PUT /api/messages/:id/read` - Mark as read

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## Test Credentials

### Religious Leaders
- Email: `leader1@faith.com` | Password: `password123` (Pastor John Smith - Christianity)
- Email: `leader2@faith.com` | Password: `password123` (Imam Ahmed Hassan - Islam)
- Email: `leader3@faith.com` | Password: `password123` (Rabbi David Cohen - Judaism)

### Worshipers
- Email: `worshiper1@faith.com` | Password: `password123` (Sarah Johnson)
- Email: `worshiper2@faith.com` | Password: `password123` (Michael Brown)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/             # Business logic
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── posts.controller.js
│   │   ├── reels.controller.js
│   │   ├── follows.controller.js
│   │   ├── messages.controller.js
│   │   └── notifications.controller.js
│   ├── routes/                  # API routes
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── posts.routes.js
│   │   ├── reels.routes.js
│   │   ├── follows.routes.js
│   │   ├── messages.routes.js
│   │   └── notifications.routes.js
│   └── middleware/              # Middleware functions
│       ├── auth.js              # JWT authentication
│       └── upload.js            # File upload handling
├── uploads/                     # Uploaded media files
├── database.sql                 # Database schema
├── server.js                    # Main server file
├── package.json
├── .env.example
└── .env                         # Environment variables (create this)
```
