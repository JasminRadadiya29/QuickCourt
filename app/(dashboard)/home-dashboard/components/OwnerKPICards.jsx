import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from 'app/components/AppIcon';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, Star } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import { useAuth } from 'app/providers';

const OwnerKPICards = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState([
    {
      id: 1,
      title: "Total Bookings",
      value: "0",
      change: null,
      changeType: null,
      icon: "Calendar",
      color: "bg-blue-100 text-blue-600",
      description: "This month"
    },
    {
      id: 2,
      title: "Active Courts",
      value: "0",
      change: null,
      changeType: null,
      icon: "Activity",
      color: "bg-green-100 text-green-600",
      description: "Currently available"
    },
    {
      id: 3,
      title: "Monthly Earnings",
      value: 0,
      change: null,
      changeType: null,
      icon: "DollarSign",
      color: "bg-purple-100 text-purple-600",
      description: "Current month"
    },
    {
      id: 4,
      title: "Avg. Rating",
      value: "0",
      change: null,
      changeType: null,
      icon: "Star",
      color: "bg-yellow-100 text-yellow-600",
      description: "From reviews"
    }
  ]);
  
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
        
        // Fetch reviews (if available)
        let averageRating = 0;
        let reviewCount = 0;
        try {
          // Fetch reviews for each facility and combine them
          const reviewsPromises = facilityIds.map(id => apiFetch(`/api/reviews?facilityId=${id}`));
          const reviewsResponses = await Promise.all(reviewsPromises);
          
          // Flatten all reviews into a single array
          const allReviews = reviewsResponses.flat();
          
          if (allReviews && allReviews.length > 0) {
            const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
            averageRating = totalRating / allReviews.length;
            reviewCount = allReviews.length;
          }
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
        
        // Update KPI data
        setKpiData([
          {
            id: 1,
            title: "Total Bookings",
            value: bookings.length.toString(),
            change: null,
            changeType: null,
            icon: "Calendar",
            color: "bg-blue-100 text-blue-600",
            description: "All time"
          },
          {
            id: 2,
            title: "Active Courts",
            value: activeCourts.toString(),
            change: null,
            changeType: null,
            icon: "Activity",
            color: "bg-green-100 text-green-600",
            description: "Currently available"
          },
          {
            id: 3,
            title: "Monthly Earnings",
            value: currentMonthEarnings,
            change: null,
            changeType: null,
            icon: "DollarSign",
            color: "bg-purple-100 text-purple-600",
            description: "Current month"
          },
          {
            id: 4,
            title: "Avg. Rating",
            value: averageRating ? averageRating.toFixed(1) : "N/A",
            change: null,
            changeType: null,
            icon: "Star",
            color: "bg-yellow-100 text-yellow-600",
            description: reviewCount ? `From ${reviewCount} reviews` : "No reviews yet"
          }
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

  const handleCardClick = () => {
    router.push('/facility-owner-dashboard');
  };

  return (
    <div className="bg-muted/30 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Your Business Overview
          </h2>
          <p className="text-muted-foreground">
            Track your facility performance and earnings
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData?.map((kpi) => (
            <div
              key={kpi?.id}
              onClick={handleCardClick}
              className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:shadow-elevated transition-all hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${kpi?.color}`}>
                  <Icon name={kpi?.icon} size={24} />
                </div>
                
                <div className={`flex items-center space-x-1 text-sm ${
                  kpi?.changeType === 'increase' ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={kpi?.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                    size={16} 
                  />
                  <span className="font-medium">{kpi?.change}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {kpi?.value}
                </h3>
                <p className="text-sm font-medium text-foreground mb-1">
                  {kpi?.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {kpi?.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleCardClick}
            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
          >
            View Detailed Analytics →
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerKPICards;