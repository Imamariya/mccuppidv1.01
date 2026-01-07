# MalluCupid Backend API

Complete backend server for the MalluCupid dating application built with Express.js, MongoDB, and Socket.IO.

## Features

- 🔐 **Authentication** - JWT-based user authentication with bcrypt password hashing
- 👥 **User Profiles** - Complete profile management with images and preferences
- 💘 **Matching System** - Like/reject matching with daily limits
- 💬 **Real-time Chat** - Socket.IO powered messaging system
- 💳 **Subscriptions** - Pro and Premium plans with Stripe integration
- 🔔 **Notifications** - Real-time notifications for likes, messages, and matches
- 🗺️ **Geolocation** - MongoDB geospatial queries for location-based matching
- 🛡️ **Admin Panel** - User verification and content moderation
- 📱 **Mobile Ready** - REST API with CORS support

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO
- **Authentication**: JWT + bcryptjs
- **Payment**: Stripe API
- **File Storage**: AWS S3 (optional)

## Installation

### Prerequisites

- Node.js 16+
- MongoDB 5.0+
- npm or yarn

### Setup

1. **Clone and navigate to server directory**
```bash
cd server
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mallucupid
JWT_SECRET=your-super-secret-key
STRIPE_SECRET_KEY=sk_test_...
```

3. **Start MongoDB**
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use your local MongoDB installation
mongod
```

4. **Run development server**
```bash
npm run dev
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/upload-images` - Upload profile images
- `POST /api/auth/verification-selfie` - Submit verification selfie

### Matching
- `GET /api/match/feed` - Get match feed
- `POST /api/match/like/:userId` - Like a user
- `POST /api/match/reject/:userId` - Reject a user
- `GET /api/match/mutual` - Get mutual matches

### Chat
- `POST /api/chat/start/:userId` - Start new chat
- `GET /api/chat/list` - Get user's chats
- `GET /api/chat/:chatId` - Get chat messages
- `POST /api/chat/:chatId/message` - Send message

### Subscription
- `GET /api/subscription/plans` - Get subscription plans
- `GET /api/subscription/current` - Get current subscription
- `POST /api/subscription/create` - Create subscription
- `POST /api/subscription/cancel` - Cancel subscription

## Database Models

### User
- Email, password, profile info
- Location (geospatial)
- Verification status
- Pro subscription status
- Match preferences
- Daily match limits

### Match
- User IDs
- Action (like/reject/super_like)
- Timestamp

### Chat
- Participants
- Messages with metadata
- Last message tracking
- Activity status

### Subscription
- Plan type (free/pro/premium)
- Stripe integration
- Feature access
- Renewal dates

### Notification
- Type (like/message/match/etc)
- User reference
- Read status
- Timestamps

## Socket.IO Events

### Client to Server
- `join-user` - User joins their private room
- `send-message` - Send chat message
- `typing` - Typing indicator

### Server to Client
- `new-message` - Incoming message
- `user-typing` - User is typing
- `match-notification` - New match
- `like-notification` - New like

## Running Tests

```bash
npm test
```

## Build for Production

```bash
npm run build
npm start
```

## Docker Deployment

```bash
docker build -t mallucupid-backend .
docker run -p 5000:5000 --env-file .env mallucupid-backend
```

## Environment Variables

See `.env.example` for all available configuration options.

## Error Handling

All errors return JSON with appropriate HTTP status codes:
```json
{
  "error": "Error message"
}
```

## Security

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens with expiration
- CORS enabled for frontend domains
- MongoDB injection protection via Mongoose
- Rate limiting recommended in production

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## Support

For issues and questions, please create a GitHub issue.

## License

MIT License
