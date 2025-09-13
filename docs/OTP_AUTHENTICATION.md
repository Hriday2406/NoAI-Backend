# OTP-Based Authentication API

This API now uses OTP (One-Time Password) based authentication instead of traditional password-based authentication. Users will receive OTPs via email for both registration and login.

## Environment Variables Required

Add these to your `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/noai-backend
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
NODE_ENV=development

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Authentication Flow

### 1. User Registration

**Step 1: Request OTP for Registration**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "OTP sent to your email for verification",
  "data": {
    "email": "john@example.com",
    "message": "Please check your email for OTP"
  }
}
```

**Step 2: Verify OTP and Complete Registration**
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

Response:
```json
{
  "success": true,
  "message": "Registration completed successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "isVerified": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "jwt-token-here"
  }
}
```

### 2. User Login

**Step 1: Request OTP for Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "Login OTP sent to your email",
  "data": {
    "email": "john@example.com",
    "message": "Please check your email for login OTP"
  }
}
```

**Step 2: Verify Login OTP**
```
POST /api/auth/verify-login-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "654321"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "isVerified": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "jwt-token-here"
  }
}
```

## Protected Routes

Use the JWT token in Authorization header for protected routes:

```
Authorization: Bearer your-jwt-token-here
```

**Get Current User**
```
GET /api/auth/me
```

**Update Profile**
```
PUT /api/auth/profile
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

## Key Features

- **OTP Expiration**: OTPs expire after 10 minutes
- **Email Verification**: Users must verify their email during registration
- **Secure OTP Storage**: OTPs are hashed before storing in database
- **Resend Logic**: If registration OTP expires, user can request a new one by calling register again
- **Account Status**: Only verified and active users can login
- **JWT Integration**: Once OTP is verified, traditional JWT tokens are used for session management

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

- `400`: Bad request (missing fields, invalid OTP, expired OTP)
- `401`: Unauthorized (user not found, not verified, not active)
- `500`: Server error

Example error response:
```json
{
  "success": false,
  "message": "OTP has expired. Please request a new OTP"
}
```