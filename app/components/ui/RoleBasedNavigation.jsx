import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const RoleBasedNavigation = ({ user, isAuthenticated, activePath, isMobile = false, onNavigate }) => {
  const navigationItems = [
    {
      label: 'Home',
      path: '/home-dashboard',
      icon: 'Home',
      roles: ['user', 'facility_owner', 'admin'],
      requiresAuth: false
    },
    {
      label: 'Find Venues',
      path: '/venues-listing-search',
      icon: 'MapPin',
      roles: ['user', 'facility_owner', 'admin'],
      requiresAuth: false
    },
    {
      label: 'My Account',
      path: '/user-profile-my-bookings',
      icon: 'User',
      roles: ['user', 'facility_owner', 'admin'],
      requiresAuth: true
    },
    {
      label: 'Dashboard',
      path: '/facility-owner-dashboard',
      icon: 'BarChart3',
      roles: ['facility_owner'],
      requiresAuth: true
    }
  ];

  const filteredItems = navigationItems?.filter(item => {
    // Check authentication requirement
    if (item?.requiresAuth && !isAuthenticated) {
      return false;
    }
    
    // Check role requirement
    if (isAuthenticated && user && !item?.roles?.includes(user?.role)) {
      return false;
    }
    
    // Show public items to non-authenticated users
    if (!isAuthenticated && !item?.requiresAuth) {
      return true;
    }
    
    return isAuthenticated;
  });

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  if (isMobile) {
    return (
      <nav className="space-y-2">
        {filteredItems?.map((item, index) => (
          <Link
            key={index}
            to={item?.path}
            onClick={handleNavClick}
            className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-smooth ${
              activePath === item?.path
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-accent'
            }`}
          >
            <Icon name={item?.icon} size={20} />
            <span className="font-medium">{item?.label}</span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-8">
      {filteredItems?.map((item, index) => (
        <Link
          key={index}
          to={item?.path}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
            activePath === item?.path
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
        >
          <Icon name={item?.icon} size={16} />
          <span>{item?.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default RoleBasedNavigation;