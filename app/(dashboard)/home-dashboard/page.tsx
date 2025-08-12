"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import HeroBanner from './components/HeroBanner';
import FeaturedVenues from './components/FeaturedVenues';
import PopularSports from './components/PopularSports';
import RecentBookings from './components/RecentBookings';
import OwnerKPICards from './components/OwnerKPICards';
import QuickActions from './components/QuickActions';
import NotificationToast from './components/NotificationToast';
import { useAuth } from '../../providers';

export default function HomeDashboard() {
  // Get authentication state from context
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect facility owners to their dashboard
  useEffect(() => {
    if (isAuthenticated && user && (user as any).role === 'facility_owner') {
      router.push('/facility-owner-dashboard');
    }
  }, [isAuthenticated, user, router]);

  // If user is a facility owner, return null to prevent rendering the home page
  if (isAuthenticated && user && (user as any).role === 'facility_owner') {
    return null;
  }

  return (
    <DashboardLayout>
      <main>
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
            {(user as any).role === 'facility_owner' && <OwnerKPICards />}
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
    </DashboardLayout>
  );
}
