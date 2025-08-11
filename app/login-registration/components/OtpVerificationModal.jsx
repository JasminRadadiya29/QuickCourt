import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from 'app/components/ui/Button';

import Icon from 'app/components/AppIcon';

const OtpVerificationModal = ({ isOpen, onClose, email, userRole }) => {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  // Mock OTP for verification
  const mockOtp = '123456';

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value?.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput?.focus();
    }
    
    setError('');
  };

  const handleKeyDown = (index, e) => {
    if (e?.key === 'Backspace' && !otp?.[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp?.join('');
    
    if (otpString?.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    
    if (otpString !== mockOtp) {
      setError(`Invalid OTP. Use: ${mockOtp} for verification`);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API verification
    setTimeout(() => {
      // Store user data
      localStorage.setItem('user', JSON.stringify({
        id: Date.now(),
        email: email,
        role: userRole || 'user',
        name: 'New User',
        isAuthenticated: true
      }));
      
      setIsLoading(false);
      onClose();
      
      // Navigate based on role
      if (userRole === 'facility_owner') {
        router.push('/facility-owner-dashboard');
      } else {
        router.push('/home-dashboard');
      }
    }, 1500);
  };

  const handleResend = () => {
    setTimeLeft(300);
    setCanResend(false);
    setError('');
    setOtp(['', '', '', '', '', '']);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-card rounded-lg shadow-elevated">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Verify Your Email</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-md transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Mail" size={24} className="text-primary" />
            </div>
            <p className="text-muted-foreground">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-medium text-foreground">{email}</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Enter verification code
              </label>
              <div className="flex space-x-3 justify-center">
                {otp?.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e?.target?.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-smooth"
                  />
                ))}
              </div>
              {error && (
                <p className="text-sm text-error mt-2 text-center">{error}</p>
              )}
            </div>
            
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Code expires in {formatTime(timeLeft)}
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={!canResend}
                  className="text-sm text-primary hover:text-primary/80 transition-smooth"
                >
                  Resend verification code
                </button>
              )}
            </div>
            
            <Button
              onClick={handleVerify}
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              iconName="CheckCircle"
              iconPosition="left"
            >
              Verify Email
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground text-center">
              Demo: Use code <span className="font-mono font-medium">{mockOtp}</span> for verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;