'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/apiClient';
import Icon from 'app/components/AppIcon';
import Link from 'next/link';

const StatCard = ({ title, value, icon, color, link }) => {
  return (
    <Link 
      href={link} 
      className="bg-card border border-border rounded-lg p-4 shadow-soft hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </Link>
  );
};

const RecentActivityItem = ({ title, description, time, icon, color }) => {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-md transition-colors">
      <div className={`p-2 rounded-full ${color} flex-shrink-0 mt-1`}>
        <Icon name={icon} size={16} />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
};

const AdminDashboardContent = () => {
  const [stats, setStats] = useState({
    pendingVenues: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch stats
      const pendingVenuesData = await apiFetch('/api/admin/venues/pending?limit=1');
      const usersData = await apiFetch('/api/admin/users?limit=1');
      const bookingsData = await apiFetch('/api/admin/bookings?limit=1');
      
      setStats({
        pendingVenues: pendingVenuesData.pagination?.total || 0,
        totalUsers: usersData.pagination?.total || 0,
        totalBookings: bookingsData.pagination?.total || 0,
        totalRevenue: bookingsData.totalRevenue || 0,
      });
      
      // Fetch recent activity (this would be a separate endpoint in a real app)
      // For now, we'll simulate it with recent bookings
      const recentBookingsData = await apiFetch('/api/admin/bookings?limit=5');
      setRecentActivity(recentBookingsData.bookings || []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 text-error p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Pending Venues" 
          value={stats.pendingVenues} 
          icon="Building2" 
          color="bg-warning/10 text-warning"
          link="/admin/facilities"
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon="Users" 
          color="bg-primary/10 text-primary"
          link="/admin/users"
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.totalBookings} 
          icon="Calendar" 
          color="bg-success/10 text-success"
          link="/admin/bookings"
        />
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(stats.totalRevenue)} 
          icon="DollarSign" 
          color="bg-secondary/10 text-secondary"
          link="/admin/bookings"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/admin/facilities" 
            className="flex items-center space-x-2 p-3 bg-muted rounded-md hover:bg-muted/70 transition-colors"
          >
            <Icon name="CheckSquare" size={20} className="text-success" />
            <span>Approve Venues</span>
          </Link>
          <Link 
            href="/admin/users" 
            className="flex items-center space-x-2 p-3 bg-muted rounded-md hover:bg-muted/70 transition-colors"
          >
            <Icon name="UserCheck" size={20} className="text-primary" />
            <span>Manage Users</span>
          </Link>
          <Link 
            href="/admin/bookings" 
            className="flex items-center space-x-2 p-3 bg-muted rounded-md hover:bg-muted/70 transition-colors"
          >
            <Icon name="CalendarCheck" size={20} className="text-secondary" />
            <span>Review Bookings</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
        <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
        <div className="space-y-1">
          {recentActivity.length > 0 ? (
            recentActivity.map((booking, index) => (
              <RecentActivityItem 
                key={index}
                title={`Booking at ${booking.venue?.name || 'Unknown Venue'}`}
                description={`${booking.user?.name || 'Unknown User'} - ${booking.status}`}
                time={getTimeAgo(booking.createdAt || booking.date)}
                icon="Calendar"
                color="bg-primary/10 text-primary"
              />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No recent activity</p>
          )}
        </div>
        <div className="mt-4 text-center">
          <Link 
            href="/admin/bookings" 
            className="text-sm text-primary hover:underline"
          >
            View All Activity
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;