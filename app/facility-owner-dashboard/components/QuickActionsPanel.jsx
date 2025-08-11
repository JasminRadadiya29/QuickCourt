import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'app/components/AppIcon';
import Button from 'app/components/ui/Button';

const QuickActionsPanel = () => {
  const quickActions = [
    {
      title: 'Add New Venue',
      description: 'Create a new sports facility',
      icon: 'Plus',
      color: 'success',
      path: '/add-venue',
      badge: null
    },
    {
      title: 'Manage Courts',
      description: 'Edit court details and pricing',
      icon: 'Settings',
      color: 'primary',
      path: '/manage-courts',
      badge: null
    },
    {
      title: 'View Bookings',
      description: 'Check upcoming reservations',
      icon: 'Calendar',
      color: 'warning',
      path: '/bookings',
      badge: 12
    },
    {
      title: 'Set Availability',
      description: 'Update court schedules',
      icon: 'Clock',
      color: 'secondary',
      path: '/availability',
      badge: 3
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'success':
        return 'bg-success/10 text-success border-success/20 hover:bg-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20';
      case 'secondary':
        return 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        
        <div className="space-y-3">
          {quickActions?.map((action, index) => (
            <Link
              key={index}
              to={action?.path}
              className={`block p-4 rounded-lg border transition-smooth ${getColorClasses(action?.color)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name={action?.icon} size={20} />
                  <div>
                    <h4 className="font-medium">{action?.title}</h4>
                    <p className="text-xs opacity-80">{action?.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {action?.badge && (
                    <span className="bg-current text-white text-xs px-2 py-1 rounded-full">
                      {action?.badge}
                    </span>
                  )}
                  <Icon name="ChevronRight" size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={16} className="text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">New booking confirmed</p>
              <p className="text-xs text-muted-foreground">Court A - Basketball</p>
            </div>
            <span className="text-xs text-muted-foreground">2m ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
              <Icon name="AlertCircle" size={16} className="text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Maintenance scheduled</p>
              <p className="text-xs text-muted-foreground">Court B - Tennis</p>
            </div>
            <span className="text-xs text-muted-foreground">1h ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <Icon name="DollarSign" size={16} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Payment received</p>
              <p className="text-xs text-muted-foreground">$45.00 - John Smith</p>
            </div>
            <span className="text-xs text-muted-foreground">3h ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;