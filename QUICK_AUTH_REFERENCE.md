# Quick Reference: Authentication System

## 🔐 Password Reset Implementation

### Frontend Components
- **ForgotPasswordForm** - Request password reset via email
- **ResetPasswordForm** - Set new password with token

### Backend Routes  
- `POST /api/auth/forgot-password` - Generate reset token
- `POST /api/auth/reset-password` - Apply new password
- `POST /api/auth/change-password` - Change password (authenticated)

### User Flows

#### Forgot Password
```
#/login → Click "Forgot?" 
  ↓
#/forgot-password (enter email)
  ↓
Email received with reset link
  ↓
#/reset-password?token=xyz (enter new password)
  ↓
#/login (success, login with new password)
```

#### Login
```
#/login → Email/Password
  ↓
Validate credentials
  ↓
Generate JWT token
  ↓
#/user/dashboard (user) or #/admin/dashboard (admin)
```

#### Sign Up
```
#/signup → Multi-step form
  Step 1: Basic info
  Step 2: Email/Password
  Step 3: OTP verification
  Step 4: Profile photos
  Step 5: Selfie verification
  Step 6: Preferences
  ↓
Auto-login → #/user/dashboard
```

## 🧪 Testing

### Login (Test Credentials)
```bash
User:
  Email: user@user.com
  Password: User@123

Admin:
  Email: admin@admin.com
  Password: Admin@123
```

### API Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@user.com","password":"User@123"}'
```

**Forgot Password:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@user.com"}'
```

**Reset Password:**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"reset_token_here","newPassword":"NewPass@123"}'
```

## 📝 Password Rules

- ✅ Min 8 characters
- ✅ Uppercase letter
- ✅ Lowercase letter  
- ✅ Number
- ✅ Special char (!@#$%^&*)

Example: `SecurePass@123`

## 🛠️ Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
MONGODB_URI=mongodb://...
SENDGRID_API_KEY=...
FRONTEND_URL=http://localhost:3000
```

## 📱 Mobile Routes

| Route | Description |
|-------|-------------|
| `#/login` | Login page |
| `#/signup` | Sign up page |
| `#/forgot-password` | Forgot password page |
| `#/reset-password` | Reset password page |
| `#/user/dashboard` | User dashboard |
| `#/admin/dashboard` | Admin dashboard |

## 🔒 Security

| Feature | Implementation |
|---------|-----------------|
| Password Hashing | bcryptjs (10 rounds) |
| Auth Token | JWT (7 days) |
| Reset Token | 15 minutes expiry |
| Email Validation | RFC format |
| Input Validation | Server & client-side |
| SQL Injection | Mongoose validation |
| CORS | Configured |

## 📦 Files Created

**Frontend:**
- `components/ForgotPasswordForm.tsx`
- `components/ResetPasswordForm.tsx`
- `app/forgot-password/page.tsx`
- `app/reset-password/page.tsx`
- `api/auth/forgot-password/route.ts`
- `api/auth/reset-password/route.ts`

**Backend:**
- `server/src/routes/passwordReset.ts`

**Updated:**
- `services/authService.ts` (new methods)
- `components/LoginForm.tsx` (forgot link)
- `App.tsx` (new routes)
- `server/src/models/User.ts` (reset token fields)
- `server/src/server.ts` (new route import)

**Documentation:**
- `AUTH_SYSTEM.md` (complete guide)

## 🚀 Deploy Checklist

- [ ] Set JWT_SECRET to strong random value
- [ ] Configure MongoDB Atlas connection
- [ ] Set up SendGrid for emails
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting
- [ ] Add error logging (Sentry)
- [ ] Test all endpoints
- [ ] Load test login flow
- [ ] Security audit

## ✅ Verification

**Frontend loads:**
```bash
npm run dev
# Visit http://localhost:5173
# Test login with user@user.com / User@123
# Click "Forgot?" to test password reset flow
```

**Backend runs:**
```bash
cd server && npm run dev
# Endpoints available at http://localhost:5000/api/auth/*
# Check console for mock operations
```

**Git commits:**
```bash
git log --oneline
# Should show:
# - feat: add complete authentication system
# - docs: add comprehensive authentication documentation
```

## 📞 Support

For issues:
1. Check browser console for JWT tokens
2. Check server console for logs
3. Verify credentials in localStorage
4. Test with Postman collection
5. Check environment variables
6. Read AUTH_SYSTEM.md for details
