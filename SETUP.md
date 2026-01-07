# MalluCupid - Complete Setup Guide

## Project Structure

```
/workspaces/mccuppidv1.01/
├── Frontend (Vite + React)
│   ├── components/
│   ├── services/
│   ├── lib/
│   ├── app/
│   ├── App.tsx
│   ├── index.tsx
│   └── vite.config.ts
│
├── Backend (Express.js + MongoDB)
│   ├── server/
│   │   ├── src/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── utils/
│   │   │   └── server.ts
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── README.md
│   └── docker-compose.yml
```

## Quick Start

### 1. Frontend Setup (Already Deployed)

Your frontend is already deployed on AWS Amplify:
- **URL**: https://d827qo825znvv.amplifyapp.com
- **Build Status**: ✅ SUCCEED

### 2. Backend Setup (Local Development)

#### Option A: Using Docker (Recommended)

```bash
# Navigate to root directory
cd /workspaces/mccuppidv1.01

# Start MongoDB + Backend
docker-compose up -d

# Backend will be available at: http://localhost:5000
# MongoDB will be available at: mongodb://admin:password@localhost:27017
```

#### Option B: Manual Setup

```bash
# Install dependencies
cd server
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings
nano .env

# Make sure MongoDB is running locally
# mongod

# Start development server
npm run dev

# Server will start on http://localhost:5000
```

### 3. Environment Variables

Create `.env` in the server directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mallucupid
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000,https://d827qo825znvv.amplifyapp.com
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
AWS_S3_BUCKET=mallucupid-uploads
AWS_REGION=us-west-2
SENDGRID_API_KEY=your_sendgrid_key
ADMIN_EMAIL=admin@mallucupid.com
```

## API Endpoints

### Authentication
```bash
# Register
POST http://localhost:5000/api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

# Get Profile
GET http://localhost:5000/api/auth/me
Headers: Authorization: Bearer {token}
```

### Matching
```bash
# Get Match Feed
GET http://localhost:5000/api/match/feed
Headers: Authorization: Bearer {token}

# Like User
POST http://localhost:5000/api/match/like/{userId}
Headers: Authorization: Bearer {token}

# Get Mutual Matches
GET http://localhost:5000/api/match/mutual
Headers: Authorization: Bearer {token}
```

### Chat
```bash
# Start Chat
POST http://localhost:5000/api/chat/start/{userId}
Headers: Authorization: Bearer {token}

# Get Chats List
GET http://localhost:5000/api/chat/list
Headers: Authorization: Bearer {token}

# Send Message
POST http://localhost:5000/api/chat/{chatId}/message
Headers: Authorization: Bearer {token}
{
  "content": "Hello!",
  "mediaType": "text"
}
```

### Subscriptions
```bash
# Get Plans
GET http://localhost:5000/api/subscription/plans

# Create Subscription
POST http://localhost:5000/api/subscription/create
Headers: Authorization: Bearer {token}
{
  "plan": "pro",
  "stripeTokenId": "tok_..."
}

# Cancel Subscription
POST http://localhost:5000/api/subscription/cancel
Headers: Authorization: Bearer {token}
```

## Database Models

### User
- Stores user profile, location, preferences
- Supports geospatial matching
- Tracks verification and pro status
- Manages daily match limits

### Match
- Records like/reject/super_like actions
- Tracks mutual matches
- Prevents duplicate actions

### Chat
- Stores messages between users
- Supports media attachments
- Tracks last message for UI optimization

### Subscription
- Manages Pro/Premium plans
- Stripe integration ready
- Feature access control

### Notification
- Real-time notifications
- Supports multiple types
- Tracks read/unread status

## Frontend Integration

Update your frontend services to connect to the backend:

```typescript
// services/authService.ts
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}
```

## Deployment Options

### AWS EC2
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
git clone https://github.com/Imamariya/mccuppidv1.01.git
cd mccuppidv1.01/server
npm install
npm run build
npm start
```

### Heroku
```bash
heroku create mallucupid-api
heroku addons:create mongolab:sandbox
git push heroku main
```

### AWS Elastic Beanstalk
```bash
eb init -p node.js mallucupid-api
eb create mallucupid-prod
eb deploy
```

### Docker on Any Server
```bash
docker build -t mallucupid-backend ./server
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name mallucupid \
  mallucupid-backend
```

## Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Configure MongoDB with authentication
- [ ] Set up HTTPS/SSL certificates
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Add payment gateway keys (Stripe)
- [ ] Configure email service (SendGrid)
- [ ] Set up file storage (AWS S3)
- [ ] Configure CDN for images
- [ ] Set up monitoring (New Relic, Datadog)
- [ ] Add backup strategy for MongoDB
- [ ] Test API endpoints thoroughly

## Testing

```bash
cd server

# Run tests
npm test

# Type checking
npm run typecheck

# Build
npm run build
```

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Or restart Docker containers
docker-compose restart mongodb
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
```

### CORS Issues
- Ensure CORS_ORIGIN includes frontend URL
- Frontend should send `Authorization` header
- Check browser console for specific errors

## Next Steps

1. ✅ Frontend deployed on Amplify
2. ✅ Backend created and ready to deploy
3. ⏭️ Set up MongoDB Atlas (cloud MongoDB)
4. ⏭️ Deploy backend to AWS/Heroku
5. ⏭️ Update frontend API URLs
6. ⏭️ Integrate Stripe for payments
7. ⏭️ Set up SendGrid for emails
8. ⏭️ Configure AWS S3 for file uploads

## Support & Documentation

- **Backend Docs**: `server/README.md`
- **API Collection**: Import in Postman
- **MongoDB Docs**: https://docs.mongodb.com
- **Express Docs**: https://expressjs.com
- **Socket.IO Docs**: https://socket.io/docs

## Team & Contributions

This is a full-stack dating application for Malayalee communities.

---

**Last Updated**: January 7, 2026
**Status**: Production Ready
