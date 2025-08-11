import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import type { SendOTPRequest, SendOTPResponse, OTPData } from '../../../types/otp';
import { generateOTP, storeOTPData, cleanupExpiredOTPs, hasRecentOTP } from '../../../lib/otpUtils';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

const resend = new Resend(process.env.RESEND_API_KEY || 're_f5cFWcPa_E3DHJTnPGmG1uSGbf89jNzSh');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Resend API key is available
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not found in environment variables');
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Clean up expired OTPs first
    cleanupExpiredOTPs();

    // Check if email has a recent OTP to prevent spam
    if (hasRecentOTP(email)) {
      return res.status(429).json({ error: 'Please wait 30 seconds before requesting another OTP' });
    }

    // Check if email is already registered
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    // Generate a 6-digit OTP
    const otp = generateOTP();
    
    // Store OTP in memory with expiration (2 minutes)
    storeOTPData(email, otp);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email],
      subject: 'Your QuickCourt Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">QuickCourt</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your verification code</p>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin: 0 0 20px 0; text-align: center;">Verification Code</h2>
            <p style="color: #666; margin: 0 0 20px 0; text-align: center;">
              Use the following code to verify your email address:
            </p>
            <div style="background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${otp}</span>
            </div>
            <p style="color: #666; margin: 20px 0 0 0; text-align: center; font-size: 14px;">
              This code will expire in 2 minutes.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                If you didn't request this code, please ignore this email.
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send OTP email' });
    }

    return res.status(200).json({ 
      message: 'OTP sent successfully',
      email: email
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
