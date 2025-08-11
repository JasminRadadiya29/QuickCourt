import React from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import KPICard from './components/KPICard';
import BookingTrendsChart from './components/BookingTrendsChart';
import EarningsChart from './components/EarningsChart';
import PeakHoursChart from './components/PeakHoursChart';
import QuickActionsPanel from './components/QuickActionsPanel';
import RecentBookingsWidget from './components/RecentBookingsWidget';
import BookingCalendar from './components/BookingCalendar';

const FacilityOwnerDashboard = () => {
  const kpiData = [
    {
      title: 'Total Bookings',
      value: '1,247',
      change: '+12.5',
      changeType: 'increase',
      icon: 'Calendar',
      color: 'primary'
    },
    {
      title: 'Active Courts',
      value: '8',
      change: null,
      changeType: null,
      icon: 'MapPin',
      color: 'success'
    },
    {
      title: 'Monthly Revenue',
      value: '$15,840',
      change: '+8.2',
      changeType: 'increase',
      icon: 'DollarSign',
      color: 'warning'
    },
    {
      title: 'Occupancy Rate',
      value: '78%',
      change: '+5.1',
      changeType: 'increase',
      icon: 'TrendingUp',
      color: 'primary'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Facility Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your sports facility performance.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Charts Section - 8 columns */}
            <div className="lg:col-span-8 space-y-8">
              <BookingTrendsChart />
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <EarningsChart />
                <PeakHoursChart />
              </div>
            </div>

            {/* Sidebar - 4 columns */}
            <div className="lg:col-span-4">
              <QuickActionsPanel />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <RecentBookingsWidget />
            <BookingCalendar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacilityOwnerDashboard;