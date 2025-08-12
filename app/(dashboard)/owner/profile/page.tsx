'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/providers';
import DashboardLayout from '../../components/DashboardLayout';

export default function OwnerProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not an owner
  React.useEffect(() => {
    if (!loading && (!user || user.role !== 'facility_owner')) {
      router.push('/login-registration');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <DashboardLayout>
        <main className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="p-6">
        <h1 className="text-xl font-semibold">Owner Profile</h1>
      </main>
    </DashboardLayout>
  );
}
