# Authentication System Documentation

## Overview

Complete authentication system with Login, Signup, Password Reset, and Email verification for MalluCupid backend.

## Features

- ✅ **User Registration** - New user signup with email validation
- ✅ **User Login** - JWT-based authentication
- ✅ **Password Reset** - Forgot password flow with email link
- ✅ **Password Change** - Change password for authenticated users
- ✅ **User Profile** - Get current user information
- 📧 **Email Service** - SendGrid/Gmail integration for password resets and welcome emails
- 🔒 **Password Hashing** - Bcrypt with configurable rounds
- 🎫 **JWT Tokens** - Secure token-based authentication

## API Endpoints

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Account created successfully. Welcome email sent.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "507f1f77bcf86cd799439011",
  "role": "user"
}
```

**Response (Error - 400):**
```json
{
  "error": "Email already registered"
}
```

**Validations:**
- Email must be unique and valid format
- Password minimum 8 characters
- Name is required
- Welcome email sent automatically

---

### 2. Login User
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (Success - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "507f1f77bcf86cd799439011",
  "role": "user"
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### 3. Get Current User
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (Success - 200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "age": 28,
  "gender": "male",
  "bio": "Love traveling and hiking",
  "isVerified": false,
  "isPro": false,
  "role": "user",
  "createdAt": "2024-01-07T10:30:00.000Z"
}
```

---

### 4. Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

**Features:**
- Generates 15-minute expiring reset token
- Sends HTML email with reset link
- Does not reveal if email exists (security)
- Token cannot be reused

---

### 5. Reset Password
**Endpoint:** `POST /api/auth/reset-password`

**Request:**
```json
{
  "token": "abc123def456...",
  "newPassword": "NewSecure123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password reset successfully. Please login with your new password."
}
```

**Validations:**
- Token must be valid and not expired
- Password minimum 8 characters
- Must contain: uppercase, lowercase, number, special character
- Token is invalidated after use

---

### 6. Change Password
**Endpoint:** `POST /api/auth/change-password`

**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 7. Update Profile
**Endpoint:** `PUT /api/auth/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Request:**
```json
{
  "name": "John Doe",
  "age": 28,
  "gender": "male",
  "bio": "Love traveling",
  "location": {
    "type": "Point",
    "coordinates": [-118.2437, 34.0522]
  },
  "relationshipPreferences": {
    "ageMin": 20,
    "ageMax": 35,
    "genderPreference": ["female"],
    "distanceRadius": 50,
    "relationshipType": "casual"
  }
}
```

**Response (Success - 200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "age": 28,
  "isProfileComplete": true,
  ...
}
```

---

## Email Configuration

### SendGrid Setup (Recommended)

1. **Create SendGrid Account:**
   - Go to https://sendgrid.com
   - Sign up and verify account
   - Create API key

2. **Set Environment Variables:**
   ```env
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=SG.xxx...
   EMAIL_FROM=noreply@yourdomain.com
   FRONTEND_URL=https://your-frontend-url.com
   ```

3. **Email Templates:**
   - Password reset email with 15-minute expiring link
   - Welcome email on signup
   - Verification email (if enabled)

### Gmail Setup

1. **Generate App Password:**
   - Enable 2-factor authentication on Google account
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy generated password

2. **Set Environment Variables:**
   ```env
   EMAIL_SERVICE=gmail
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASSWORD=generated-app-password
   ```

---

## Authentication Flow

### Registration Flow
```
User Signup Form
      ↓
POST /api/auth/register
      ↓
Validate Input
      ↓
Hash Password
      ↓
Create User in MongoDB
      ↓
Generate JWT Token
      ↓
Send Welcome Email
      ↓
Return Token & User ID
      ↓
Frontend Stores Token
      ↓
User Logged In
```

### Login Flow
```
User Login Form
      ↓
POST /api/auth/login
      ↓
Find User by Email
      ↓
Compare Passwords
      ↓
Generate JWT Token
      ↓
Return Token & Role
      ↓
Frontend Stores Token
      ↓
User Authenticated
```

### Password Reset Flow
```
User Forgot Password
      ↓
POST /api/auth/forgot-password
      ↓
Find User by Email
      ↓
Generate Reset Token (15 min expiry)
      ↓
Hash Token & Store in DB
      ↓
Send Email with Reset Link
      ↓
User Clicks Link
      ↓
POST /api/auth/reset-password
      ↓
Validate Token & Expiry
      ↓
Update Password
      ↓
Invalidate Token
      ↓
Success Message
```

---

## JWT Token Structure

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "role": "user",
  "iat": 1704610200,
  "exp": 1705215000
}
```

**Secret:** Set in `JWT_SECRET` environment variable

---

## Error Handling

### Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Email already registered | Use different email |
| 400 | Email already exists | Email is taken |
| 401 | Invalid credentials | Check email and password |
| 401 | No token provided | Include Authorization header |
| 401 | Invalid token | Token expired, login again |
| 400 | Invalid or expired reset token | Request new password reset |
| 500 | Internal Server Error | Contact support |

---

## Security Best Practices

✅ **Implemented:**
- Password hashing with bcrypt
- JWT token expiration (7 days)
- Reset token expiration (15 minutes)
- Token hashing before storage
- Email validation
- Password strength validation
- CORS protection
- SQL injection prevention (MongoDB)

⚠️ **Additional Recommendations:**
- Use HTTPS in production
- Implement rate limiting on auth endpoints
- Add 2-factor authentication
- Monitor failed login attempts
- Log security events
- Regular security audits
- Update dependencies regularly

---

## Testing

### Using Postman

1. **Create New Collection** - MalluCupid Auth

2. **Register:**
   ```
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json
   
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "TestPass123"
   }
   ```

3. **Login:**
   ```
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "password": "TestPass123"
   }
   ```

4. **Get Current User:**
   ```
   GET http://localhost:5000/api/auth/me
   Authorization: Bearer {token}
   ```

5. **Forgot Password:**
   ```
   POST http://localhost:5000/api/auth/forgot-password
   Content-Type: application/json
   
   {
     "email": "test@example.com"
   }
   ```

---

## Troubleshooting

### Email Not Sending

1. **Check Environment Variables:**
   ```bash
   echo $SENDGRID_API_KEY
   ```

2. **Verify SendGrid Setup:**
   - API key is correct
   - Sender email is verified in SendGrid
   - Account has email credits

3. **Check Logs:**
   ```
   [Auth] Email sent to user@example.com: <message-id>
   ```

4. **Test Email Service:**
   ```typescript
   import { sendPasswordResetEmail } from '../utils/email';
   
   await sendPasswordResetEmail('test@example.com', 'test-token');
   ```

### Password Not Resetting

1. **Check Token Expiry:** Token valid for 15 minutes
2. **Verify Token Format:** Must be plain text, not hashed
3. **Check Password Requirements:**
   - Minimum 8 characters
   - Uppercase letter
   - Lowercase letter
   - Number
   - Special character (!@#$%^&*)

### Token Not Working

1. **Token Expired:** Get new token via login
2. **Wrong Format:** Include "Bearer " prefix in Authorization header
3. **Corrupted Token:** Login again to get new token
4. **Wrong Secret:** Check JWT_SECRET matches on server

---

## API Response Format

All API responses follow this format:

**Success (2xx):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error (4xx/5xx):**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Future Enhancements

- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication (2FA)
- [ ] Email verification required
- [ ] OAuth 2.0 support
- [ ] Session management
- [ ] Device fingerprinting
- [ ] Audit logging
- [ ] Biometric authentication

---

**Last Updated:** January 7, 2026
**Status:** Production Ready
