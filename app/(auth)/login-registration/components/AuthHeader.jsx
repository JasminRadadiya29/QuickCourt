import React from 'react';
import Link from 'next/link';
import Icon from 'app/components/AppIcon';

const AuthHeader = () => {
  return (
    <header className="w-full bg-card border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home-dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-xl font-bold text-foreground">QuickCourt</span>
          </Link>

          {/* Right side placeholder - can be used for future elements */}
          <div></div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;