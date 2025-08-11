export interface OTPData {
  otp: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

export interface SendOTPRequest {
  email: string;
}

export interface SendOTPResponse {
  message: string;
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  email: string;
}

export interface OTPVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

// Extend global to include our OTP store
declare global {
  var otpStore: Map<string, OTPData> | undefined;
}
