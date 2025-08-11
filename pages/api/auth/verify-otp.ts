import type { NextApiRequest, NextApiResponse } from 'next';
import type { VerifyOTPRequest, VerifyOTPResponse } from '../../../types/otp';
import { getOTPData, removeOTPData, cleanupExpiredOTPs } from '../../../lib/otpUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Clean up expired OTPs first
    cleanupExpiredOTPs();

    // Get stored OTP data
    const otpData = getOTPData(email);

    if (!otpData) {
      return res.status(400).json({ error: 'No OTP found for this email or OTP has expired' });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Remove OTP from store after successful verification
    removeOTPData(email);

    return res.status(200).json({ 
      message: 'OTP verified successfully',
      email: email
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
