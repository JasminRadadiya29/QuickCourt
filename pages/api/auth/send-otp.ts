import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { generateOTP, storeOTPData, cleanupExpiredOTPs, hasRecentOTP } from '../../../lib/otpUtils';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

// Read SMTP config from env
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
} = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
  console.warn(
    '[send-otp] Missing SMTP env vars. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL'
  );
}

// Reusable transporter (module-scoped)
let transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST!,
      port: Number(SMTP_PORT || 587),
      secure:
        String(SMTP_SECURE || '').toLowerCase() === 'true' ||
        Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER!,
        pass: SMTP_PASS!,
      },
    });
  }
  return transporter;
}

function otpEmailHtml(otp: string) {
  return `
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
  `;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Clean error if env not set
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
    return res.status(500).json({ error: 'Server misconfigured: missing SMTP env vars' });
  }

  try {
    const { email } = req.body as { email?: string };
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Rate limit + cleanup
    cleanupExpiredOTPs();
    if (hasRecentOTP(email)) {
      return res.status(429).json({ error: 'Please wait 30 seconds before requesting another OTP' });
    }

    // Ensure not already registered
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    // Generate + store OTP
    const otp = generateOTP();
    storeOTPData(email, otp);

    // TEMPORARILY BYPASSING EMAIL SENDING
    // Will be implemented later
    console.log('Email sending bypassed for development');
    console.log(`OTP for ${email}: ${otp} (displayed for testing purposes only)`);

    return res.status(200).json({ message: 'OTP sent successfully', email });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
