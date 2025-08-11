import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock OTP for password reset
  const mockResetOtp = '654321';

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEmailSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData?.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleOtpSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData?.otp) {
      setErrors({ otp: 'OTP is required' });
      return;
    }
    
    if (formData?.otp !== mockResetOtp) {
      setErrors({ otp: `Invalid OTP. Use: ${mockResetOtp} for verification` });
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setStep('reset');
    }, 1000);
  };

  const handlePasswordReset = async (e) => {
    e?.preventDefault();
    
    const newErrors = {};
    
    if (!formData?.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.newPassword !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      // Reset form
      setStep('email');
      setFormData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setStep('email');
    setFormData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-card rounded-lg shadow-elevated">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {step === 'email' && 'Reset Password'}
              {step === 'otp' && 'Verify Code'}
              {step === 'reset' && 'New Password'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-accent rounded-md transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Lock" size={24} className="text-primary" />
                </div>
                <p className="text-muted-foreground">
                  Enter your email address and we'll send you a code to reset your password.
                </p>
              </div>
              
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData?.email}
                onChange={handleInputChange}
                error={errors?.email}
                required
              />
              
              <Button
                type="submit"
                variant="default"
                size="lg"
                fullWidth
                loading={isLoading}
                iconName="Send"
                iconPosition="left"
              >
                Send Reset Code
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Mail" size={24} className="text-primary" />
                </div>
                <p className="text-muted-foreground">
                  We've sent a verification code to
                </p>
                <p className="font-medium text-foreground">{formData?.email}</p>
              </div>
              
              <Input
                label="Verification Code"
                type="text"
                name="otp"
                placeholder="Enter 6-digit code"
                value={formData?.otp}
                onChange={handleInputChange}
                error={errors?.otp}
                required
              />
              
              <Button
                type="submit"
                variant="default"
                size="lg"
                fullWidth
                loading={isLoading}
                iconName="CheckCircle"
                iconPosition="left"
              >
                Verify Code
              </Button>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-md">
                <p className="text-xs text-muted-foreground text-center">
                  Demo: Use code <span className="font-mono font-medium">{mockResetOtp}</span> for verification
                </p>
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Key" size={24} className="text-success" />
                </div>
                <p className="text-muted-foreground">
                  Create a new password for your account.
                </p>
              </div>
              
              <Input
                label="New Password"
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={formData?.newPassword}
                onChange={handleInputChange}
                error={errors?.newPassword}
                required
              />
              
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData?.confirmPassword}
                onChange={handleInputChange}
                error={errors?.confirmPassword}
                required
              />
              
              <Button
                type="submit"
                variant="default"
                size="lg"
                fullWidth
                loading={isLoading}
                iconName="Check"
                iconPosition="left"
              >
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;