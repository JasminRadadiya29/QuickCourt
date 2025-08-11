import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';

const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef?.current && !menuRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...');
    setIsOpen(false);
  };

  const menuItems = [
    {
      label: 'My Profile',
      path: '/user-profile-my-bookings',
      icon: 'User'
    },
    {
      label: 'My Bookings',
      path: '/user-profile-my-bookings',
      icon: 'Calendar'
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: 'Settings'
    }
  ];

  // Add facility owner specific items
  if (user?.role === 'facility_owner') {
    menuItems?.splice(2, 0, {
      label: 'Owner Dashboard',
      path: '/facility-owner-dashboard',
      icon: 'BarChart3'
    });
  }

  // Add admin specific items
  if (user?.role === 'admin') {
    menuItems?.splice(2, 0, {
      label: 'Admin Panel',
      path: '/admin',
      icon: 'Shield'
    });
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-smooth"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
          {user?.avatar ? (
            <Image 
              src={user?.avatar} 
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon name="User" size={16} color="var(--color-muted-foreground)" />
          )}
        </div>
        <span className="hidden sm:block text-sm font-medium text-foreground">
          {user?.name}
        </span>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-md shadow-elevated z-1010">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium text-popover-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          
          <div className="py-2">
            {menuItems?.map((item, index) => (
              <Link
                key={index}
                to={item?.path}
                className="flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-accent transition-smooth"
                onClick={() => setIsOpen(false)}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            ))}
            
            <div className="border-t border-border mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-accent transition-smooth w-full text-left"
              >
                <Icon name="LogOut" size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;