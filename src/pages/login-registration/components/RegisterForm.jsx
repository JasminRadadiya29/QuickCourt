import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const RegisterForm = ({ onOtpRequired }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'user', label: 'Sports Enthusiast', description: 'Book courts and play sports' },
    { value: 'facility_owner', label: 'Facility Owner', description: 'Manage venues and bookings' },
    { value: 'admin', label: 'Admin', description: 'Platform administration' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
    if (errors?.role) {
      setErrors(prev => ({ ...prev, role: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData?.name?.trim()?.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(formData?.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Trigger OTP verification
      onOtpRequired(formData?.email);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        type="text"
        name="name"
        placeholder="Enter your full name"
        value={formData?.name}
        onChange={handleInputChange}
        error={errors?.name}
        required
      />
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
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Create a strong password"
        value={formData?.password}
        onChange={handleInputChange}
        error={errors?.password}
        description="Must contain uppercase, lowercase, and number"
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="Confirm your password"
        value={formData?.confirmPassword}
        onChange={handleInputChange}
        error={errors?.confirmPassword}
        required
      />
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Select Your Role <span className="text-error">*</span>
        </label>
        <div className="space-y-3">
          {roleOptions?.map((option) => (
            <div
              key={option?.value}
              onClick={() => handleRoleChange(option?.value)}
              className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
                formData?.role === option?.value
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                  formData?.role === option?.value
                    ? 'border-primary bg-primary' :'border-border'
                }`}>
                  {formData?.role === option?.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{option?.label}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{option?.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {errors?.role && (
          <p className="text-sm text-error">{errors?.role}</p>
        )}
      </div>
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="left"
      >
        Create Account
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          iconName="Mail"
          iconPosition="left"
        >
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          iconName="Facebook"
          iconPosition="left"
        >
          Facebook
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;