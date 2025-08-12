'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/providers';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminProfilePage() {
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
      <main className="p-6">
        <h1 className="text-xl font-semibold">Admin Profile</h1>
      </main>
    </DashboardLayout>
  );
}
