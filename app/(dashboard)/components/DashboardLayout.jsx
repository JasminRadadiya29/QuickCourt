'use client';

import React from 'react';
import NavigationHeader from '../../components/layout/NavigationHeader';
import { useAuth } from 'app/providers';

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;