'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/providers';
import DashboardLayout from '../../components/DashboardLayout';
import OwnerBookings from './components/OwnerBookings';

export default function OwnerBookingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not an owner
  React.useEffect(() => {
    if (!loading && (!user || user.role !== 'facility_owner')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not owner, don't render anything (will be redirected)
  if (!user || user.role !== 'facility_owner') {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>
        <OwnerBookings />
      </div>
    </DashboardLayout>
  );
}
