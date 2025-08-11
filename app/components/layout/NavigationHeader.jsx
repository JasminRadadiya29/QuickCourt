import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../AppIcon';
import UserMenu from './UserMenu';
import RoleBasedNavigation from './RoleBasedNavigation';
import BookingStatusIndicator from '../ui/BookingStatusIndicator';
import { useAuth } from '../../providers';

const NavigationHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Get authentication state from context
  const { user, isAuthenticated } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-card border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href={isAuthenticated && user?.role === 'facility_owner' ? '/facility-owner-dashboard' : '/home-dashboard'} 
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-foreground">QuickCourt</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <RoleBasedNavigation 
              user={user} 
              isAuthenticated={isAuthenticated}
              activePath={pathname}
              onNavigate={() => {}}
            />
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Booking Status Indicator */}
            <BookingStatusIndicator />
            
            {/* User Menu or Auth Links */}
            {isAuthenticated ? (
              <UserMenu user={user} />
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  href="/login-registration" 
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Sign In
                </Link>
                <Link 
                  href="/login-registration" 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-smooth"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-smooth"
              aria-label="Toggle mobile menu"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-1020 bg-background">
          <div className="px-4 py-6 space-y-4">
            <RoleBasedNavigation 
              user={user} 
              isAuthenticated={isAuthenticated}
              activePath={location?.pathname}
              isMobile={true}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
            
            {!isAuthenticated && (
              <div className="pt-4 border-t border-border space-y-3">
                <Link 
                  href="/login-registration"
                  className="block w-full text-center py-2 text-muted-foreground hover:text-foreground transition-smooth"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/login-registration"
                  className="block w-full text-center bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-smooth"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavigationHeader;