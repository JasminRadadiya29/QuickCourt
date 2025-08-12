'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/providers';
import DashboardLayout from '../../components/DashboardLayout';
import AdminCourts from './components/AdminCourts';

const AdminCourtsPage = () => {
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
          <h1 className="text-2xl font-bold">Manage Courts</h1>
          <p className="text-muted-foreground">Approve and manage courts across the platform</p>
        </div>
        
        <AdminCourts />
      </div>
    </DashboardLayout>
  );
};

export default AdminCourtsPage;