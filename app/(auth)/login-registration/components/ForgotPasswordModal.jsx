import React, { useState } from 'react';
import Button from 'app/components/ui/Button';
import Input from 'app/components/ui/Input';
import Icon from 'app/components/AppIcon';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    
    // Simulate API call for password reset
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setFormData({ email: '' });
    setErrors({});
    setIsSubmitted(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-card rounded-lg shadow-elevated">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {isSubmitted ? 'Reset Link Sent' : 'Reset Password'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-accent rounded-md transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Lock" size={24} className="text-primary" />
                </div>
                <p className="text-muted-foreground">
                  Enter your email address and we'll send you a password reset link.
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
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={24} className="text-success" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Check Your Email
                </h3>
                <p className="text-muted-foreground">
                  We've sent a password reset link to <strong>{formData.email}</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please check your email and click the link to reset your password.
                </p>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                fullWidth
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;