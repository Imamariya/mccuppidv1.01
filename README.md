# MalluCupid: Production-Ready Dating Platform

MalluCupid is a high-end, mobile-first dating application designed specifically for the Malayalee community. It focuses on security, verified connections, and a premium aesthetic.

## 🚀 Vision & Design Language
- **Brand Identity**: Premium, intimate, and authentic.
- **Visuals**: Dark-themed (Zinc-950), high-contrast (Emerald-500), using Serif brand fonts (Playfair Display) for an editorial feel.
- **Target Platform**: Strictly Mobile & Tablet. Desktop users are redirected via `DesktopBlocker`.

---

## 🏗️ Technical Architecture (Frontend)

### 1. Routing System
- **Hash-based Routing**: The app uses `App.tsx` to manage state-based routing via `window.location.hash`. This ensures stability in single-page environments and bypasses server-side configuration requirements for sub-routes.
- **Route Protection**: The system checks `mallucupid_role` and `mallucupid_token` in local storage before rendering sensitive views.

### 2. Service Layer
The application follows a decoupled service-oriented architecture. All logic is abstracted into `services/`:
- `authService`: Handles JWT simulation and role persistence.
- `profileService`: Manages multi-step onboarding and profile updates.
- `matchService`: Controls the discovery feed, swipe logic, and match retrieval.
- `chatService`: Manages real-time messaging and media sharing.
- `adminService`: Provides management data for the oversight console.
- `limitService`: Client-side enforcement of business rules (Likes/Matches).

---

## 🔐 Core Features & Business Rules

### 1. Role-Based Access Control (RBAC)
- **User Role**: Access to Discovery, Matches, Chat, and Pro Upgrades.
- **Admin Role**: Access to the Management Dashboard (Verifications, Moderation, User Control).

### 2. Mandatory Verification Flow
- **Selfie Verification**: During signup, users MUST capture a live selfie.
- **Admin Review**: Profiles are marked `unverified` until an admin compares the live selfie against profile photos.
- **Restrictions**: Unverified users can browse but **cannot** like or chat.

### 3. Matchmaking & Discovery
- **Swipe Logic**: Tinder-style "Like" or "Reject".
- **Mutual Matches**: A "Match" is created only if both users like each other.
- **Pro Limits (Free Tier)**:
  - 50 Likes per day.
  - 10 Matches per day.
  - 3 Messages per chat.
- **Distance Filtering**: Uses browser Geolocation to calculate proximity (Haversine formula).

### 4. Secure Chat System
- **Verification Lock**: Both users in a match must be "Verified" to open the chat.
- **Media Sharing**: Supports text, images, and videos (max 15MB).
- **Socket Simulation**: Ready for Socket.io integration via `socketService.ts`.

### 5. Pro Plan Subscription
- **Price**: ₹99 for 30 days.
- **Integrations**: Prepared for Razorpay (see `paymentService.ts` and `RazorpayButton.tsx`).
- **Benefits**: Removes all daily limits, enables priority visibility.

---

## 🛠️ Integration Guide (For Backend/AI)

### 1. API Strategy
The app currently simulates Next.js routes in the `api/` folder. For a real backend integration:
- Replace `services/*.ts` mock logic with `axios` or `fetch` calls to your endpoints.
- **Security**: All API calls expect a `Bearer` token in the Authorization header.
- **Image Storage**: The frontend expects permanent HTTPS URLs. Ensure your S3/Cloudinary logic returns a signed URL.

### 2. Socket.io Events
The `socketService.ts` is configured to listen for:
- `new_message`: Triggers UI update in `ChatPage`.
- `notification_update`: Updates the `NotificationBell`.
- `profile_verified`: Live update when admin approves a user.

### 3. Pending Implementation Tasks
- [ ] **Database Schema**: Implementation of Users, Matches, Messages, Likes, and Notifications tables.
- [ ] **JWT Signing**: Real server-side JWT generation with a secure secret.
- [ ] **Real Geolocation**: Backend spatial queries for "Nearby" discovery.
- [ ] **Media Moderation**: AWS Rekognition or similar for auto-detecting NSFW content.
- [ ] **Razorpay Webhooks**: Handle successful payments on the server to update `plan_expiry_date`.

---

## 📦 Environment Variables Needed
```env
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
DATABASE_URL=
JWT_SECRET=
AWS_S3_BUCKET=
```

---
*Developed by Senior Product UI Engineering team.*