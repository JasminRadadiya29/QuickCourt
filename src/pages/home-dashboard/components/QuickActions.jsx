import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ user }) => {
  const navigate = useNavigate();

  const getUserActions = () => {
    if (!user) {
      return [
        {
          title: "Sign Up",
          description: "Create your account to start booking",
          icon: "UserPlus",
          color: "bg-primary text-primary-foreground",
          action: () => navigate('/login-registration')
        },
        {
          title: "Browse Venues",
          description: "Explore available sports facilities",
          icon: "Search",
          color: "bg-secondary text-secondary-foreground",
          action: () => navigate('/venues-listing-search')
        }
      ];
    }

    const baseActions = [
      {
        title: "Find Venues",
        description: "Search for sports facilities near you",
        icon: "Search",
        color: "bg-primary text-primary-foreground",
        action: () => navigate('/venues-listing-search')
      },
      {
        title: "My Bookings",
        description: "View and manage your reservations",
        icon: "Calendar",
        color: "bg-secondary text-secondary-foreground",
        action: () => navigate('/user-profile-my-bookings')
      }
    ];

    if (user?.role === 'facility_owner') {
      baseActions?.push(
        {
          title: "Manage Venues",
          description: "Add or edit your sports facilities",
          icon: "Building",
          color: "bg-purple-600 text-white",
          action: () => navigate('/facility-owner-dashboard')
        },
        {
          title: "View Analytics",
          description: "Track bookings and earnings",
          icon: "BarChart3",
          color: "bg-green-600 text-white",
          action: () => navigate('/facility-owner-dashboard')
        }
      );
    }

    return baseActions;
  };

  const actions = getUserActions();

  return (
    <div className="bg-background py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Quick Actions
          </h2>
          <p className="text-muted-foreground">
            Get started with these common tasks
          </p>
        </div>

        <div className={`grid grid-cols-1 ${actions?.length > 2 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'} gap-6 max-w-4xl mx-auto`}>
          {actions?.map((action, index) => (
            <div
              key={index}
              onClick={action?.action}
              className="bg-card border border-border rounded-lg p-6 text-center cursor-pointer hover:shadow-elevated transition-all hover:scale-105"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${action?.color}`}>
                <Icon name={action?.icon} size={28} />
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {action?.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                {action?.description}
              </p>
              
              <Button variant="outline" size="sm" fullWidth>
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;