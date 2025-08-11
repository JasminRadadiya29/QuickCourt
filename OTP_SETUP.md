# OTP Verification Setup Guide

## Overview
This project now includes OTP-based email verification for user registration. The system uses Resend's API to send verification codes via email.

## Features
- ✅ Email-based OTP verification
- ✅ 6-digit verification codes
- ✅ 2-minute expiration timer
- ✅ Resend OTP functionality (after 2 minutes)
- ✅ Rate limiting (30-second cooldown between requests)
- ✅ No OTP storage in database (in-memory only)
- ✅ Beautiful email templates
- ✅ Auto-focus input fields with backspace navigation
- ✅ User only created in database after successful OTP verification
- ✅ Prevents registration of already existing emails
- ✅ Combined OTP verification and registration in single API call

## Environment Setup

### 1. Create Environment File
Create a `.env.local` file in the root directory with the following content:

```env
RESEND_API_KEY=re_f5cFWcPa_E3DHJTnPGmG1uSGbf89jNzSh
```

### 2. Alternative: Set Environment Variable
If you can't create the `.env.local` file, you can set the environment variable directly:

**Windows (PowerShell):**
```powershell
$env:RESEND_API_KEY="re_f5cFWcPa_E3DHJTnPGmG1uSGbf89jNzSh"
```

**Windows (Command Prompt):**
```cmd
set RESEND_API_KEY=re_f5cFWcPa_E3DHJTnPGmG1uSGbf89jNzSh
```

## How It Works

### Registration Flow
1. User fills out registration form
2. Clicks "Send Verification Code"
3. System validates form data and checks if email already exists
4. Sends OTP via email using Resend API
5. User enters 6-digit code
6. System verifies OTP and creates user account in single step
7. Redirects to login

### OTP Storage
- OTPs are stored in memory (global.otpStore)
- No database storage for security
- Automatic cleanup after verification or expiration
- 2-minute expiration timer

### API Endpoints

#### POST /api/auth/send-otp
Sends OTP to user's email
```json
{
  "email": "user@example.com"
}
```

#### POST /api/auth/register-with-otp
Verifies OTP and creates user account in single step
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "user",
  "otp": "123456"
}
```

## Components

### OTPVerification.jsx
- Handles OTP input with 6 separate fields
- Auto-focus navigation
- Countdown timer for resend
- Error handling and validation

### Updated RegisterForm.jsx
- Integrated OTP verification flow
- Form validation before sending OTP
- Seamless transition to verification screen

## Email Template
The system sends beautifully formatted HTML emails with:
- QuickCourt branding
- Clear 6-digit code display
- Expiration information
- Professional styling

## Security Features
- OTP expiration after 2 minutes
- No OTP storage in database (in-memory only)
- Automatic cleanup of expired OTPs
- Rate limiting (30-second cooldown between OTP requests)
- Input validation and sanitization
- User only created after successful OTP verification
- Prevents registration of already existing emails
- Combined verification and registration prevents race conditions

## Testing
1. Start the development server: `npm run dev`
2. Navigate to registration page
3. Fill out the form
4. Click "Send Verification Code"
5. Check your email for the OTP
6. Enter the code and verify

## Troubleshooting

### OTP Not Received
- Check spam folder
- Verify email address is correct
- Check Resend API key is valid
- Check console for API errors

### Invalid OTP Error
- Ensure code is entered correctly
- Check if OTP has expired (2 minutes)
- Try resending the code

### API Errors
- Verify RESEND_API_KEY is set
- Check network connectivity
- Review server logs for details
