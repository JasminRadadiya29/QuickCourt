import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from 'app/components/ui/Button';
import Input from 'app/components/ui/Input';
import { Checkbox } from 'app/components/ui/Checkbox';
import { apiFetch } from '@/lib/apiClient';


const LoginForm = ({ onForgotPassword }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [generalError, setGeneralError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await apiFetch('/api/auth/login', { method: 'POST', body: {
        email: formData.email,
        password: formData.password,
      }, auth: false });
      // store token and user
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      // Navigate based on role
      if (result.user.role === 'facility_owner') router.push('/facility-owner-dashboard');
      else if (result.user.role === 'admin') router.push('/');
      else router.push('/home-dashboard');
    } catch (e) {
      setGeneralError(e?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(errors?.general || generalError) && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-md">
          <p className="text-sm text-error">{errors?.general || generalError}</p>
        </div>
      )}
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
        placeholder="Enter your password"
        value={formData?.password}
        onChange={handleInputChange}
        error={errors?.password}
        required
      />
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
        />
        
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:text-primary/80 transition-smooth"
        >
          Forgot password?
        </button>
      </div>
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        iconName="LogIn"
        iconPosition="left"
      >
        Sign In
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

export default LoginForm;