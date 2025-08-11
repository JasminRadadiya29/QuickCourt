import React from 'react';
import { useRouter } from 'next/navigation';
import Icon from 'app/components/AppIcon';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, Star } from 'lucide-react';
import { formatINR } from '../../../../src/utils/currency';

const OwnerKPICards = () => {
  const router = useRouter();

  const kpiData = [
    {
      id: 1,
      title: "Total Bookings",
      value: "156",
      change: "+12%",
      changeType: "increase",
      icon: "Calendar",
      color: "bg-blue-100 text-blue-600",
      description: "This month"
    },
    {
      id: 2,
      title: "Active Courts",
      value: "8",
      change: "+2",
      changeType: "increase",
      icon: "Activity",
      color: "bg-green-100 text-green-600",
      description: "Currently available"
    },
    {
      id: 3,
      title: "Monthly Earnings",
      value: formatINR(4250),
      change: "+18%",
      changeType: "increase",
      icon: "DollarSign",
      color: "bg-purple-100 text-purple-600",
      description: "August 2025"
    },
    {
      id: 4,
      title: "Avg. Rating",
      value: "4.8",
      change: "+0.2",
      changeType: "increase",
      icon: "Star",
      color: "bg-yellow-100 text-yellow-600",
      description: "From 89 reviews"
    }
  ];

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