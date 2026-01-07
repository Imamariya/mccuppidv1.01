# Authentication System Documentation

## Overview

Complete authentication system with login, signup, and password reset functionality for MalluCupid dating application.

## Features Implemented

### 1. **Login System**
- Email and password authentication
- Mock user credentials for testing
- JWT token generation and storage
- Role-based access (user/admin)
- Automatic redirect based on user role
- Real-time form validation
- Loading states and error handling

**Test Credentials:**
```
Admin:
  Email: admin@admin.com
  Password: Admin@123
  
User:
  Email: user@user.com
  Password: User@123
```

### 2. **Sign Up System**
- Multi-step registration process
- Email validation
- OTP verification system
- Profile completion (photos, selfie, preferences)
- Password strength validation
- Account creation with JWT authentication
- Auto-login after successful registration

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

### 3. **Forgot Password System**
- Email-based password reset
- Secure reset token generation
- Token expiration (15 minutes)
- Password strength validation
- Success/error messaging
- Auto-redirect to login

### 4. **Reset Password System**
- Token-based password reset
- URL-based token passing
- Password strength validation
- Confirmation password matching
- Invalid/expired token handling
- Auto-logout after password reset

## File Structure

### Frontend Components

```
components/
├── LoginForm.tsx              # Login form with validation
├── SignupForm.tsx             # Initial signup form
├── ForgotPasswordForm.tsx      # Password reset request form
├── ResetPasswordForm.tsx       # New password creation form
├── SignupProgress.tsx          # Signup progress indicator
├── SignupStepBasic.tsx         # Basic info step
├── SignupStepAccount.tsx       # Account creation step
├── SignupStepOTP.tsx           # OTP verification step
├── SignupStepPhotos.tsx        # Photo upload step
├── SignupStepSelfie.tsx        # Selfie verification step
└── SignupStepRelationship.tsx  # Preferences step
```

### Frontend Pages

```
app/
├── login/page.tsx             # Login page
├── signup/page.tsx            # Signup page
├── forgot-password/page.tsx    # Forgot password page
└── reset-password/page.tsx     # Reset password page
```

### Backend Routes

```
server/src/routes/
├── auth.ts                     # Login & registration routes
└── passwordReset.ts            # Password reset routes
```

### Backend API Endpoints

```
Authentication Endpoints:
POST /api/auth/register        # User registration
POST /api/auth/login           # User login
GET  /api/auth/me              # Get current user
PUT  /api/auth/profile         # Update profile
POST /api/auth/upload-images   # Upload profile images
POST /api/auth/verification-selfie  # Submit selfie

Password Reset Endpoints:
POST /api/auth/forgot-password      # Request password reset
POST /api/auth/reset-password       # Reset password with token
POST /api/auth/change-password      # Change password (authenticated)
```

## API Specifications

### 1. Login Endpoint

**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "User@123"
}
```

**Response (Success - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user"
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid email or password"
}
```

### 2. Forgot Password Endpoint

**Request:**
```bash
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If this email exists, you will receive a password reset link"
}
```

### 3. Reset Password Endpoint

**Request:**
```bash
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "NewPassword@123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password reset successfully. Please login with your new password."
}
```

**Response (Error - 400):**
```json
{
  "error": "Invalid or expired reset token"
}
```

### 4. Change Password Endpoint (Authenticated)

**Request:**
```bash
POST /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id_here",
  "currentPassword": "CurrentPassword@123",
  "newPassword": "NewPassword@456"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Frontend Service Methods

### authService.ts

```typescript
// Login user
authService.login(email: string, password: string): Promise<LoginResponse>

// Register user
authService.register(formData: FormData): Promise<RegisterResponse>

// Request password reset
authService.requestPasswordReset(email: string): Promise<OTPResponse>

// Reset password with token
authService.resetPassword(token: string, password: string): Promise<OTPResponse>

// Get current user
authService.getMe(token: string): Promise<User>

// Update profile
authService.updateProfile(data: any): Promise<any>

// Check authentication
authService.isAuthenticated(): boolean

// Get stored token
authService.getToken(): string | null
```

## Password Reset Flow

### User-Initiated Reset (Forgot Password)

```
1. User visits /forgot-password page
2. Enters email address
3. ForgotPasswordForm calls authService.requestPasswordReset()
4. Backend:
   - Finds user by email
   - Generates secure reset token
   - Stores token with 15-minute expiration
   - Sends email with reset link (in production)
5. User receives email with link
6. Link format: /reset-password?token={resetToken}
7. User clicks link → ResetPasswordForm loaded
8. User enters new password
9. Form submits to authService.resetPassword(token, password)
10. Backend:
    - Validates token and expiration
    - Hashes new password
    - Updates user password
    - Clears reset token
11. User redirected to login page
12. User logs in with new password
```

### Password Change (Authenticated User)

```
1. User in settings page
2. Enters current password and new password
3. Form calls authService.changePassword()
4. Backend validates:
   - User is authenticated
   - Current password matches
   - New password meets requirements
   - New password differs from current
5. Updates password if all validations pass
```

## Security Features

### Password Security
- **Hashing:** bcryptjs with 10 rounds
- **Validation:** Enforced at client and server level
- **Requirements:** 
  - Minimum 8 characters
  - Mixed case (upper + lower)
  - Numbers and special characters
  - Cannot reuse current password

### Token Security
- **Reset Tokens:** 15-minute expiration
- **JWT Tokens:** 7-day expiration
- **Storage:** localStorage (frontend), Database (backend)
- **Validation:** Verified on every protected request

### Input Validation
- Email format validation
- Password strength validation
- Token format validation
- SQL injection prevention (Mongoose validation)

### Rate Limiting Ready
- Add express-rate-limit for:
  - Login attempts
  - Password reset requests
  - Signup attempts

## Frontend Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `#/login` | LoginPage | User login |
| `#/signup` | SignupPage | User registration |
| `#/forgot-password` | ForgotPasswordPage | Request password reset |
| `#/reset-password` | ResetPasswordPage | Reset password with token |
| `#/user/dashboard` | UserDashboard | Main user interface |
| `#/admin/dashboard` | AdminDashboard | Admin panel |

## Testing

### Using Postman Collection

Import `server/MalluCupid.postman_collection.json` to test all endpoints.

**Variables to set:**
```
baseUrl: http://localhost:5000
token: (obtained from login endpoint)
userId: (obtained from profile endpoint)
```

### Manual Testing

1. **Login Test:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@user.com","password":"User@123"}'
   ```

2. **Forgot Password Test:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"user@user.com"}'
   ```

3. **Reset Password Test:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/reset-password \
     -H "Content-Type: application/json" \
     -d '{"token":"reset_token_here","password":"NewPassword@123"}'
   ```

## Production Checklist

### Security
- [ ] Change mock credentials to real database
- [ ] Set strong JWT_SECRET in environment
- [ ] Enable HTTPS/SSL
- [ ] Implement rate limiting
- [ ] Set up CORS properly
- [ ] Implement session management
- [ ] Add security headers (helmet.js)
- [ ] Enable password hashing verification

### Email Integration
- [ ] Set up SendGrid/email service
- [ ] Create email templates for password reset
- [ ] Add email verification for signup
- [ ] Implement email confirmation links
- [ ] Set up bounce handling

### Database
- [ ] Set up MongoDB Atlas (production)
- [ ] Enable authentication
- [ ] Set up backups
- [ ] Create indexes for frequent queries
- [ ] Add database monitoring

### Monitoring & Logging
- [ ] Set up error tracking (Sentry)
- [ ] Add logging system
- [ ] Monitor failed login attempts
- [ ] Track password reset requests
- [ ] Set up alerts

### Frontend
- [ ] Update API URLs to production
- [ ] Add analytics tracking
- [ ] Implement sentry error tracking
- [ ] Test on multiple devices
- [ ] Verify email validation

## Common Issues & Solutions

### Issue: Reset Token Expired
**Solution:** Regenerate token; keep expiry reasonable (15-30 min)

### Issue: Password Too Weak
**Solution:** Show clear validation messages; provide strength meter

### Issue: Email Not Received
**Solution:** Check email service logs; verify sender address; check spam folder

### Issue: CORS Errors
**Solution:** Update CORS configuration to match frontend domain

## Next Steps

1. **Email Integration**
   - Set up SendGrid API
   - Create email templates
   - Send actual reset emails

2. **Two-Factor Authentication**
   - Add 2FA option
   - TOTP/SMS implementation
   - Backup codes

3. **Social Authentication**
   - Add Google OAuth
   - Add Facebook OAuth
   - Add Apple Sign-In

4. **Session Management**
   - Implement remember-me
   - Device management
   - Session timeout

5. **Advanced Security**
   - Rate limiting
   - Brute-force protection
   - Account lockout
   - Suspicious activity detection

## Support

For issues or questions:
1. Check the API documentation above
2. Review error messages and logs
3. Test with Postman collection
4. Check database integrity
5. Verify environment variables
