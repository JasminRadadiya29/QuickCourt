'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/providers';
import AdminDashboardLayout from '../components/AdminDashboardLayout';
import { apiFetch } from '@/lib/apiClient';
import Icon from 'app/components/AppIcon';
import Link from 'next/link';
import AdminDashboardContent from './components/AdminDashboardContent';

export default function AdminDashboardPage() {
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
    <AdminDashboardLayout>
      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform statistics and management</p>
        </div>
        
        <AdminDashboardContent />
      </main>
    </AdminDashboardLayout>
  );
}
