# Backend Connection Guide

## ✅ Status

The **frontend is now configured to connect to the Express backend** automatically with smart fallback logic:

1. **Try Express Backend** (`http://localhost:5000`)
2. **Fallback to Next.js API Routes** (if backend not available)
3. **Use Mock Data** (if neither available)

## 🚀 Running the Full Stack

### Option 1: Express Backend Only (Recommended)

**Terminal 1 - Frontend:**
```bash
cd /workspaces/mccuppidv1.01
npm run dev
# Vite runs on http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd /workspaces/mccuppidv1.01/server
npm install  # First time only
npm run dev
# Express runs on http://localhost:5000
```

Frontend will automatically detect backend and connect!

### Option 2: Using Docker Compose

**Terminal:**
```bash
cd /workspaces/mccuppidv1.01
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- Express backend on port 5000
- Then run frontend: `npm run dev`

### Option 3: Cloud Deployment

**For AWS EC2, Heroku, or DigitalOcean:**

Set environment variable on your hosting:
```env
VITE_API_URL=https://your-backend-domain.com
```

## 📋 Configuration

### Environment Variables

**Frontend (.env.local):**
```env
# Optional - specify backend URL
VITE_API_URL=http://localhost:5000
```

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://admin:password@localhost:27017/mallucupid
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
```

## 🔍 How It Works

### Smart Backend Detection

```typescript
// Automatic backend detection
1. Check if http://localhost:5000/health is reachable
2. Log result to console: "[Auth] Express backend available: true/false"
3. Use detected status for all subsequent calls
```

### Request Flow

```
Frontend API Call
    ↓
Is Express backend available?
    ├─ YES → Use http://localhost:5000/api/...
    └─ NO → Try Next.js API routes or fallback to mock
```

### Console Logs

When auth service is used, check browser console for:

```
[Auth] Express backend available: true
    ↓
Connected to Express backend - using real database

[Auth] Express backend available: false
    ↓
Using mock authentication - no database
```

## ✅ Testing Connection

### 1. Check Backend is Running

```bash
# In Terminal with backend running:
curl http://localhost:5000/health
# Should return 200 OK
```

### 2. Check Frontend Detects Backend

Open browser DevTools → Console and login. Should see:
```
[Auth] Express backend available: true
```

### 3. Test Login

Use credentials:
```
Email: user@user.com
Password: User@123
```

Should log in successfully and redirect to dashboard.

### 4. Monitor Network Tab

Browser DevTools → Network tab:
- With backend: Requests go to `http://localhost:5000/api/auth/...`
- Without backend: Falls back to mock (no requests shown)

## 🔌 API Endpoints

### Authentication Endpoints

**Express Backend:**
```
POST   /api/auth/login           - Login user
POST   /api/auth/register        - Register new user
POST   /api/auth/send-otp        - Send OTP
POST   /api/auth/verify-otp      - Verify OTP and register
GET    /api/auth/me              - Get current user
PUT    /api/auth/profile         - Update profile
POST   /api/auth/forgot-password - Request password reset
POST   /api/auth/reset-password  - Reset password
POST   /api/auth/change-password - Change password
```

**Next.js API Routes (Fallback):**
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

## 🐛 Troubleshooting

### Backend Not Connecting

**Check 1: Is backend running?**
```bash
# Terminal with backend
npm run dev
# Should show: Server running on port 5000
```

**Check 2: Check MongoDB connection**
```bash
# Backend console should show:
MongoDB connected to: mongodb://...
```

**Check 3: Check CORS configuration**
Backend must allow frontend origin:
```typescript
// server/src/server.ts
const cors = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}
```

**Check 4: Browser console errors**
```
CORS error? → Backend CORS not configured
404 error? → Backend route not found
500 error? → Backend error - check backend console
```

### Mock Authentication Active

If you see in console:
```
[Auth] Using mock authentication (backend not connected)
```

This means:
- Backend is not running or not reachable
- Falls back to mock data in memory
- Changes won't persist after refresh
- No database used

### Reset Backend Detection

To force re-check if backend is available:
```javascript
// In browser console
// Reload page to reset backend detection
location.reload()
```

## 📊 Monitoring Backend Connection

### Real-Time Status

Add this to App.tsx to display backend status:

```typescript
useEffect(() => {
  const checkStatus = async () => {
    try {
      const res = await fetch('http://localhost:5000/health');
      console.log('Backend:', res.ok ? '✅ Connected' : '❌ Offline');
    } catch {
      console.log('Backend: ❌ Not reachable');
    }
  };
  checkStatus();
}, []);
```

### Backend Health Check

Express backend has health endpoint:
```bash
curl http://localhost:5000/health
# Returns: 200 OK with health info
```

## 🔐 Production Deployment

### AWS EC2

1. Deploy backend:
```bash
ssh user@ec2-instance
git clone repo
cd server && npm install
npm start
```

2. Update frontend env:
```env
VITE_API_URL=https://your-domain.com:5000
```

3. Enable CORS in backend:
```env
CORS_ORIGIN=https://your-frontend.com
```

### Heroku

**Deploy Backend:**
```bash
heroku create mallucupid-api
git push heroku main
```

**Update Frontend:**
```env
VITE_API_URL=https://mallucupid-api.herokuapp.com
```

### AWS Amplify + EC2

**Amplify (Frontend):**
```
Set environment variables:
VITE_API_URL=https://ec2-api.yourdomain.com
```

**EC2 (Backend):**
```
Run Express server
Configure security groups to allow traffic
Set up domain/IP routing
```

## 📚 Documentation

For complete API documentation, see:
- [server/README.md](server/README.md) - Backend API docs
- [AUTH_SYSTEM.md](AUTH_SYSTEM.md) - Authentication details
- [SETUP.md](SETUP.md) - Complete setup guide

## ✨ Key Features

✓ **Automatic Backend Detection** - No manual configuration needed
✓ **Graceful Fallback** - Works even if backend unavailable
✓ **Environment-Aware** - Uses VITE_API_URL if set
✓ **Real-Time Data** - Database changes instantly visible
✓ **Secure** - JWT tokens, bcrypt hashing, CORS protection
✓ **Scalable** - Stateless API, ready for horizontal scaling

## 🎯 Quick Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Browser console shows backend connected
- [ ] Login works with test credentials
- [ ] Data persists across page refresh
- [ ] API requests visible in Network tab
- [ ] No CORS errors in console
- [ ] MongoDB connected (if using Docker)

## 📞 Need Help?

1. Check browser console for error messages
2. Check backend console for database errors
3. Verify ports 5000 and 5173 are not blocked
4. Ensure MongoDB is running (if using local)
5. Check CORS configuration in backend
6. Review AUTH_SYSTEM.md for detailed docs

---

**Status: ✅ Backend Connection Ready**

Frontend automatically detects and connects to Express backend!
