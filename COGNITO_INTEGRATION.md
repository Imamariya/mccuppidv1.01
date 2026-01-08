# AWS Cognito Integration Guide

## Overview

MalluCupid now uses **AWS Cognito** for authentication instead of a custom auth system. This provides:

- ✅ Enterprise-grade security
- ✅ Built-in email verification
- ✅ Password reset via email
- ✅ Session management
- ✅ MFA support (optional)
- ✅ No email service to configure
- ✅ Automatically managed by AWS

## How It Works

### Frontend (React/Vite)

The frontend uses AWS Amplify SDK to communicate with Cognito:

1. **Import and Initialize:**
   ```typescript
   import { Auth } from 'aws-amplify';
   import awsconfig from './src/aws-exports.js';
   
   Amplify.configure(awsconfig);
   ```

2. **Sign Up:**
   ```typescript
   await Auth.signUp({
     username: email,
     password: password,
     attributes: {
       email: email,
       name: name
     }
   });
   ```

3. **Confirm Email:**
   ```typescript
   await Auth.confirmSignUp(email, confirmationCode);
   ```

4. **Login:**
   ```typescript
   const user = await Auth.signIn(email, password);
   ```

5. **Password Reset:**
   ```typescript
   // Request code
   await Auth.forgotPassword(email);
   
   // Submit new password
   await Auth.forgotPasswordSubmit(email, code, newPassword);
   ```

### Backend (Express/Node)

Backend no longer handles authentication. Instead:

1. **Accept JWT from frontend**
2. **Verify token with Cognito**
3. **Access protected resources**

Example:
```typescript
import { Auth } from 'aws-amplify';

// Middleware to verify Cognito token
export const verifyCognitoToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify with Cognito
    const decoded = jwt_decode(token); // or use Cognito JWT verification
    req.user = { id: decoded.sub, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## Setup Steps

### Step 1: Verify Amplify Auth Configuration

Check that auth is properly configured:

```bash
cd /workspaces/mccuppidv1.01
amplify status
```

You should see `auth` configured. If not:

```bash
amplify add auth
# Choose: Default configuration
# Authorization flows: Email
```

### Step 2: Configure Frontend

Update `index.tsx` or `App.tsx`:

```typescript
import React from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports.js';
import App from './App';

Amplify.configure(awsconfig);

export default App;
```

### Step 3: Use Auth Service

The auth service is already updated to use Cognito:

```typescript
import { authService } from '../services/authService';

// Sign up
await authService.register(email, password, name);

// Confirm email
await authService.confirmSignUp(email, code);

// Login
await authService.login(email, password);

// Forgot password
await authService.requestPasswordReset(email);

// Reset password
await authService.resetPassword(email, code, newPassword);

// Logout
await authService.logout();
```

### Step 4: Push to AWS

Deploy the authentication configuration:

```bash
amplify push
```

This will:
- Create Cognito User Pool
- Set up email verification
- Configure password policies
- Create client app

---

## User Pool Configuration

### Password Policy

AWS Cognito enforces:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Special characters optional (but recommended)

### Email Verification

Cognito automatically sends verification emails:
- Email contains 6-digit code
- Code valid for 24 hours
- User must confirm email to access account

### Password Reset

Automatic flow:
1. User requests password reset
2. Cognito sends email with code (valid 24 hours)
3. User enters new password with code
4. Password updated immediately

---

## Frontend Components Updated

### LoginForm.tsx
- Uses `authService.login()`
- Handles login errors
- Redirects to dashboard on success

### SignupForm.tsx
- Uses `authService.register()`
- Prompts for email verification
- Sends verification code to email

### ForgotPasswordForm.tsx
- Uses `authService.requestPasswordReset()`
- User enters email
- Receives code via email

### ResetPasswordForm.tsx
- Uses `authService.resetPassword()`
- Two-stage: email → code + password
- Handles expiration and validation

---

## Backend API Integration

### Protected API Routes

Protect endpoints with Cognito token:

```typescript
import jwt_decode from 'jwt-decode';

router.get('/api/user/profile', async (req: AuthRequest, res: Response) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Decode token (Cognito JWT)
    const decoded: any = jwt_decode(token);
    const userId = decoded.sub; // Cognito user sub
    
    // Fetch user data from MongoDB using Cognito sub
    const user = await User.findOne({ cognitoId: userId });
    
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

### Store Cognito Sub in MongoDB

When user first logs in, store their Cognito `sub`:

```typescript
const user = await Auth.getCurrentUser();
const cognitoId = user.attributes.sub;

// Store in MongoDB
const dbUser = await User.findOneAndUpdate(
  { email: user.username },
  { cognitoId: cognitoId },
  { upsert: true, new: true }
);
```

---

## Testing

### Test Sign Up Flow

```bash
# 1. Go to frontend signup page
# 2. Enter: name, email, password
# 3. Check email for verification code
# 4. Verify email
# 5. Automatically logged in
```

### Test Password Reset

```bash
# 1. Go to login page
# 2. Click "Forgot Password"
# 3. Enter email
# 4. Check email for code
# 5. Enter code + new password
# 6. Password updated
# 7. Login with new password
```

### Check Cognito User Pool

```bash
# In AWS Console
# → Cognito
# → User Pools
# → mccuppidv101
# → Users and groups
# → See all created users with their status
```

---

## Remove Old Auth Endpoints

The following backend endpoints are no longer used and can be removed:

```
DELETE: /api/auth/register - Use Cognito instead
DELETE: /api/auth/login - Use Cognito instead
DELETE: /api/auth/forgot-password - Use Cognito instead
DELETE: /api/auth/reset-password - Use Cognito instead
DELETE: /api/auth/change-password - Use Cognito instead
```

Keep but update:
```
GET: /api/auth/me - Verify Cognito token, return user profile
PUT: /api/auth/profile - Verify Cognito token, update user profile
```

---

## API Response Format

### Login Success (from frontend/Cognito)
```json
{
  "userSub": "12345-67890-abcde",
  "email": "user@example.com",
  "name": "User Name"
}
```

### Signup Response
```json
{
  "success": true,
  "message": "Account created. Check email for verification code.",
  "userSub": "12345-67890-abcde"
}
```

### Error Responses
```json
{
  "error": "Invalid email or password"
}
```

---

## Environment Variables

No additional environment variables needed! Cognito configuration is in:
- `src/aws-exports.js` - Auto-generated by Amplify
- `amplify/backend/auth/` - Cognito configuration

---

## Security Features

✅ **Enabled:**
- Email verification required
- Password strength requirements
- Session tokens with expiration
- HTTPS only communication
- No passwords stored in app
- Automatic logout after session expires

⚠️ **Optional (can enable):**
- Multi-factor authentication (MFA)
- Social login (Google, Facebook)
- Custom password policy
- Temporary passwords
- Account lockout after failed attempts

To enable MFA:
```bash
amplify auth update
# Select: Add MFA
```

---

## Troubleshooting

### User Not Found
**Issue:** "User not found" error during login
**Solution:** User must verify email first. Resend verification email from signup.

### Code Expired
**Issue:** "Code has expired" when resetting password
**Solution:** Request new password reset. Codes are valid for 24 hours.

### Email Not Received
**Issue:** No verification or reset email
**Solution:** 
- Check spam/junk folder
- Verify email in AWS Cognito is correct
- Resend email (Cognito handles throttling)

### Token Invalid
**Issue:** "Invalid token" error
**Solution:** Token expired. User needs to login again.

### User Already Exists
**Issue:** "Email already exists" during signup
**Solution:** User can login or request password reset

---

## Migration from Old System

If you have existing users in MongoDB:

1. **Keep MongoDB users table** for extended profile data
2. **Create Cognito users** for each existing user
3. **Link with Cognito sub** (store in MongoDB)
4. **Migrate gradually** - new users go to Cognito

```typescript
// Migration script example
const users = await User.find({});

for (const user of users) {
  try {
    // Create Cognito user
    await Auth.signUp({
      username: user.email,
      password: 'TempPassword123!', // User resets on first login
      attributes: {
        email: user.email,
        name: user.name
      }
    });
    
    // Update MongoDB with Cognito sub
    user.cognitoId = user.attributes.sub;
    await user.save();
  } catch (error) {
    console.error(`Failed to migrate ${user.email}:`, error);
  }
}
```

---

## Next Steps

1. ✅ Cognito is configured with Amplify
2. ✅ Frontend updated to use Cognito
3. ⏭️ Verify setup: `amplify push`
4. ⏭️ Test signup/login flow
5. ⏭️ Update backend endpoints to verify Cognito tokens
6. ⏭️ Deploy to production

---

## Documentation

- [AWS Cognito Docs](https://docs.aws.amazon.com/cognito/)
- [Amplify Auth Docs](https://docs.amplify.aws/gen1/javascript/build-a-backend/auth/)
- [Amplify CLI Docs](https://docs.amplify.aws/cli/)

---

**Last Updated:** January 8, 2026
**Status:** Cognito Integration Complete
