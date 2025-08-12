'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from 'app/components/AppIcon';

const AdminSidebar = () => {
  const pathname = usePathname();
  
  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: 'LayoutDashboard'
    },
    {
      label: 'Facilities',
      path: '/admin/facilities',
      icon: 'Building2'
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: 'Users'
    },
    {
      label: 'Bookings',
      path: '/admin/bookings',
      icon: 'Calendar'
    },
    {
      label: 'Courts',
      path: '/admin/courts',
      icon: 'Layers'
    },
    {
      label: 'Profile',
      path: '/admin/profile',
      icon: 'User'
    }
  ];

  return (
    <div className="w-64 h-full bg-card border-r border-border">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <Icon name="Shield" size={20} color="white" />
          </div>
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        
        <nav className="space-y-1">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-smooth ${isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;