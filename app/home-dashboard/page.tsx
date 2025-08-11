"use client";
import React, { useState, useEffect } from 'react';
import NavigationHeader from 'app/components/ui/NavigationHeader';
import HeroBanner from './components/HeroBanner';
import FeaturedVenues from './components/FeaturedVenues';
import PopularSports from './components/PopularSports';
import RecentBookings from './components/RecentBookings';
import OwnerKPICards from './components/OwnerKPICards';
import QuickActions from './components/QuickActions';
import NotificationToast from './components/NotificationToast';

export default function HomeDashboard() {
  // Mock user state - replace with actual authentication context
  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user', // 'user', 'facility_owner', 'admin'
    avatar: null,
    location: 'New York, NY'
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Simulate checking authentication status
    const checkAuth = () => {
      // Replace with actual auth check
      const authStatus = localStorage.getItem('isAuthenticated');
      const userData = localStorage.getItem('userData');
      if (authStatus === 'true' && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <main className="pt-16">
        {/* Hero Banner */}
        <HeroBanner user={user} />
        {/* Featured Venues */}
        <FeaturedVenues />
        {/* Popular Sports */}
        <PopularSports />
        {/* Conditional Content Based on User Role */}
        {isAuthenticated && user ? (
          <>
            {/* Recent Bookings for all authenticated users */}
            <RecentBookings user={user} />
            {/* KPI Cards for Facility Owners */}
            {user?.role === 'facility_owner' && <OwnerKPICards />}
          </>
        ) : null}
        {/* Quick Actions */}
        <QuickActions user={user} />
        {/* Footer */}
        <footer className="bg-card border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                &copy; {new Date()?.getFullYear()} QuickCourt. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
      {/* Notification Toast */}
      <NotificationToast />
    </div>
  );
}
