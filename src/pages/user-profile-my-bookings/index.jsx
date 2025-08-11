import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import NavigationHeader from '../../components/ui/NavigationHeader';
import ProfileTab from './components/ProfileTab';
import BookingsTab from './components/BookingsTab';
import Icon from '../../components/AppIcon';

const UserProfileMyBookings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      component: ProfileTab
    },
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: 'Calendar',
      component: BookingsTab
    }
  ];

  const ActiveComponent = tabs?.find(tab => tab?.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>My Profile & Bookings - QuickCourt</title>
        <meta name="description" content="Manage your profile and view your booking history on QuickCourt" />
      </Helmet>
      <NavigationHeader />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
            <p className="text-muted-foreground">
              Manage your profile information and view your booking history
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <Icon name="Zap" size={20} color="white" />
                </div>
                <span className="text-xl font-bold text-foreground">QuickCourt</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Your trusted platform for booking sports facilities. Find and reserve courts for tennis, basketball, badminton, and more.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  <Icon name="Facebook" size={20} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  <Icon name="Twitter" size={20} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  <Icon name="Instagram" size={20} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  <Icon name="Linkedin" size={20} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/home-dashboard" className="text-muted-foreground hover:text-primary transition-smooth">Home</a></li>
                <li><a href="/venues-listing-search" className="text-muted-foreground hover:text-primary transition-smooth">Find Venues</a></li>
                <li><a href="/user-profile-my-bookings" className="text-muted-foreground hover:text-primary transition-smooth">My Bookings</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Contact Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground">
              © {new Date()?.getFullYear()} QuickCourt. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserProfileMyBookings;