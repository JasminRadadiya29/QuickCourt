'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/providers';
import DashboardLayout from '../../components/DashboardLayout';
import AdminBookings from './components/AdminBookings';

const AdminBookingsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not an admin
  React.useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
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

  // If not admin, don't render anything (will be redirected)
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Manage Bookings</h1>
          <p className="text-muted-foreground">View and manage all bookings across the platform</p>
        </div>
        
        <AdminBookings />
      </div>
    </DashboardLayout>
  );
};

export default AdminBookingsPage;