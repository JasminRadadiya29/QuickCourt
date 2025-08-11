import React, { useState, useEffect } from 'react';
import Icon from 'app/components/AppIcon';

const NotificationToast = () => {
  const [notifications, setNotifications] = useState([]);

  // Mock notifications - replace with actual notification system
  const mockNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Booking Confirmed',
      message: 'Your court reservation for Downtown Sports Complex has been confirmed.',
      timestamp: new Date(),
      autoHide: true
    },
    {
      id: 2,
      type: 'info',
      title: 'New Venue Available',
      message: 'Elite Tennis Academy just joined QuickCourt. Check it out!',
      timestamp: new Date(Date.now() - 300000),
      autoHide: true
    }
  ];

  useEffect(() => {
    // Simulate receiving notifications
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-hide notifications after 5 seconds
    notifications?.forEach((notification) => {
      if (notification?.autoHide) {
        const timer = setTimeout(() => {
          dismissNotification(notification?.id);
        }, 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications]);

  const dismissNotification = (id) => {
    setNotifications(prev => prev?.filter(notification => notification?.id !== id));
  };

  const getNotificationConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: 'CheckCircle',
          bgColor: 'bg-success/10 border-success/20',
          iconColor: 'text-success',
          titleColor: 'text-success'
        };
      case 'error':
        return {
          icon: 'XCircle',
          bgColor: 'bg-error/10 border-error/20',
          iconColor: 'text-error',
          titleColor: 'text-error'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          bgColor: 'bg-warning/10 border-warning/20',
          iconColor: 'text-warning',
          titleColor: 'text-warning'
        };
      case 'info':
      default:
        return {
          icon: 'Info',
          bgColor: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800'
        };
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return timestamp?.toLocaleDateString();
  };

  if (notifications?.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-1030 space-y-3 max-w-sm">
      {notifications?.map((notification) => {
        const config = getNotificationConfig(notification?.type);
        
        return (
          <div
            key={notification?.id}
            className={`border rounded-lg p-4 shadow-elevated backdrop-blur-sm transition-all duration-300 ${config?.bgColor}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${config?.iconColor}`}>
                <Icon name={config?.icon} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-medium ${config?.titleColor}`}>
                    {notification?.title}
                  </h4>
                  <button
                    onClick={() => dismissNotification(notification?.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
                
                <p className="text-sm text-foreground/80 mb-2">
                  {notification?.message}
                </p>
                
                <p className="text-xs text-muted-foreground">
                  {formatTime(notification?.timestamp)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationToast;