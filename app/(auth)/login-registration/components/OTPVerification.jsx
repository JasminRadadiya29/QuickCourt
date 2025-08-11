import React, { useState, useEffect } from 'react';
import Button from 'app/components/ui/Button';
import Input from 'app/components/ui/Input';
import { apiFetch } from '@/lib/apiClient';

const OTPVerification = ({ email, onVerificationSuccess, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }

    // Clear error when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const sendOTP = async () => {
    setIsSendingOTP(true);
    try {
      await apiFetch('/api/auth/send-otp', {
        method: 'POST',
        body: { email },
        auth: false
      });
      
      setTimeLeft(120);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setErrors({});
    } catch (error) {
      setErrors({ general: error?.error || 'Failed to send OTP' });
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e?.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit code' });
      return;
    }

    setIsLoading(true);
    try {
      // Call the success callback which will handle registration with OTP
      onVerificationSuccess(otpString);
    } catch (error) {
      setErrors({ otp: error?.error || 'Invalid OTP' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Verify Your Email
        </h2>
        <p className="text-muted-foreground">
          We've sent a 6-digit verification code to{' '}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      {errors?.general && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-md">
          <p className="text-sm text-error">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleVerifyOTP} className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Enter Verification Code
          </label>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                name={`otp-${index}`}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>
          {errors?.otp && (
            <p className="text-sm text-error text-center">{errors.otp}</p>
          )}
        </div>

        <div className="text-center space-y-4">
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="Check"
            iconPosition="left"
          >
            Verify Email
          </Button>

          <div className="space-y-3">
            {timeLeft > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend code in {formatTime(timeLeft)}
              </p>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={isSendingOTP}
                onClick={sendOTP}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Resend Code
              </Button>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Registration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OTPVerification;
