'use client';

import React from 'react';
import NavigationHeader from '../../../components/layout/NavigationHeader';
import AdminSidebar from './AdminSidebar';
import { useAuth } from 'app/providers';

const AdminDashboardLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;