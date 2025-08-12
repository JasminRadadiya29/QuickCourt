"use client";
import React, { useState } from 'react';
import AuthHeader from './components/AuthHeader';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import Icon from 'app/components/AppIcon';

export default function LoginRegistration() {
  const [activeTab, setActiveTab] = useState('login');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleForgotPassword = () => {
    setShowForgotModal(true);
  };

  const handleCloseForgot = () => {
    setShowForgotModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Zap" size={28} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome to QuickCourt
            </h1>
            <p className="text-muted-foreground">
              {activeTab === 'login' ?
                'Sign in to access your account and book courts' :
                'Create your account and start booking sports facilities'
              }
            </p>
          </div>
          {/* Tab Navigation */}
          <div className="bg-muted rounded-lg p-1 mb-8">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-smooth ${
                  activeTab === 'login' ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-smooth ${
                  activeTab === 'register' ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>
          {/* Form Container */}
          <div className="bg-card rounded-lg shadow-elevated p-6 border border-border">
            {activeTab === 'login' ? (
              <LoginForm onForgotPassword={handleForgotPassword} />
            ) : (
              <RegisterForm />
            )}
          </div>
          {/* Footer Links */}
          <div className="text-center mt-8 space-y-4">
            <div className="text-sm text-muted-foreground">
              {activeTab === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setActiveTab('register')}
                    className="text-primary hover:text-primary/80 font-medium transition-smooth"
                  >
                    Create one here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="text-primary hover:text-primary/80 font-medium transition-smooth"
                  >
                    Sign in here
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </main>
      {/* Modals */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={handleCloseForgot}
      />
    </div>
  );
}
