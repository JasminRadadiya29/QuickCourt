"use client";
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import KPICard from './components/KPICard';
import QuickActionsPanel from './components/QuickActionsPanel';
import RecentBookingsWidget from './components/RecentBookingsWidget';
import BookingCalendar from './components/BookingCalendar';
import { apiFetch } from '@/lib/apiClient';
import { useAuth } from 'app/providers';

export default function FacilityOwnerDashboard() {
  const [kpiData, setKpiData] = useState([
    {
      title: 'Total Bookings',
      value: '0',
      change: null,
      changeType: null,
      icon: 'Calendar',
      color: 'primary',
    },
    {
      title: 'Active Courts',
      value: '0',
      change: null,
      changeType: null,
      icon: 'MapPin',
      color: 'success',
    },
    {
      title: 'Monthly Revenue',
      value: '₹0',
      change: null,
      changeType: null,
      icon: 'DollarSign',
      color: 'warning',
    },
    {
      title: 'Occupancy Rate',
      value: '0%',
      change: null,
      changeType: null,
      icon: 'TrendingUp',
      color: 'primary',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch owner's facilities
        const facilitiesResponse = await apiFetch(`/api/facilities?owner=${user?._id}`);
        const facilities = facilitiesResponse?.data || [];
        const facilityIds = facilities.map(facility => facility._id);
        
        // Fetch bookings
        const bookingsResponse = await apiFetch('/api/owner/bookings');
        const bookings = bookingsResponse || [];
        
        // Fetch earnings data
        const earningsResponse = await apiFetch('/api/owner/earnings');
        const monthlyEarnings = earningsResponse?.monthly || [];
        const currentMonthEarnings = monthlyEarnings[monthlyEarnings.length - 1]?.earnings || 0;
        
        // Calculate active courts
        const activeCourts = facilities.reduce((total, facility) => {
          return total + (facility.courts?.length || 0);
        }, 0);
        
        // Calculate occupancy rate
        // This is a simplified calculation - in a real app, you would calculate based on available slots vs booked slots
        const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed').length;
        const totalPossibleBookings = activeCourts * 12 * 30; // Assuming 12 hours per day, 30 days per month
        const occupancyRate = totalPossibleBookings > 0 ? Math.round((confirmedBookings / totalPossibleBookings) * 100) : 0;
        
        // Update KPI data
        setKpiData([
          {
            title: 'Total Bookings',
            value: bookings.length.toString(),
            change: null,
            changeType: null,
            icon: 'Calendar',
            color: 'primary',
          },
          {
            title: 'Active Courts',
            value: activeCourts.toString(),
            change: null,
            changeType: null,
            icon: 'MapPin',
            color: 'success',
          },
          {
            title: 'Monthly Revenue',
            value: currentMonthEarnings,
            change: null,
            changeType: null,
            icon: 'DollarSign',
            color: 'warning',
          },
          {
            title: 'Occupancy Rate',
            value: `${occupancyRate}%`,
            change: null,
            changeType: null,
            icon: 'TrendingUp',
            color: 'primary',
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);
  
  return (
    <DashboardLayout>
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Facility Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your sports facility performance.
            </p>
          </div>

          {/* KPI Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData?.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                change={kpi?.change}
                changeType={kpi?.changeType}
                icon={kpi?.icon}
                color={kpi?.color}
              />
            ))}
          </div> */}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Sidebar - now full width */}
            <div className="lg:col-span-12">
              <QuickActionsPanel />
            </div>
          </div>

          {/* Bottom Section */}
          {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <RecentBookingsWidget />
            <BookingCalendar />
          </div> */}
        </div>
      </main>
    </DashboardLayout>
  );
}
