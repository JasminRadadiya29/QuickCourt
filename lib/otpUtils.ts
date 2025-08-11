import type { OTPData } from '../types/otp';

// Clean up expired OTPs
export const cleanupExpiredOTPs = () => {
  if (!global.otpStore) return;
  
  const now = Date.now();
  for (const [email, otpData] of global.otpStore.entries()) {
    if (now > otpData.expiresAt) {
      global.otpStore.delete(email);
    }
  }
};

// Get OTP data for an email
export const getOTPData = (email: string): OTPData | null => {
  if (!global.otpStore) return null;
  
  const otpData = global.otpStore.get(email);
  if (!otpData) return null;
  
  // Check if expired
  if (Date.now() > otpData.expiresAt) {
    global.otpStore.delete(email);
    return null;
  }
  
  return otpData;
};

// Store OTP data
export const storeOTPData = (email: string, otp: string): void => {
  if (!global.otpStore) {
    global.otpStore = new Map();
  }
  
  const otpData: OTPData = {
    otp,
    email,
    createdAt: Date.now(),
    expiresAt: Date.now() + (2 * 60 * 1000) // 2 minutes
  };
  
  global.otpStore.set(email, otpData);
};

// Check if email has a recent OTP (within last 30 seconds)
export const hasRecentOTP = (email: string): boolean => {
  if (!global.otpStore) return false;
  
  const otpData = global.otpStore.get(email);
  if (!otpData) return false;
  
  // Check if OTP was created within last 30 seconds
  const thirtySecondsAgo = Date.now() - (30 * 1000);
  return otpData.createdAt > thirtySecondsAgo;
};

// Remove OTP data
export const removeOTPData = (email: string): void => {
  if (!global.otpStore) return;
  global.otpStore.delete(email);
};

// Generate a random 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
