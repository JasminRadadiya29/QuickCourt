import React from 'react';
import { useRouter } from 'next/navigation';
import Button from 'app/components/ui/Button';
import Icon from 'app/components/AppIcon';

const HeroBanner = ({ user }) => {
  const router = useRouter();

  const handleFindCourts = () => {
    router.push('/venues-listing-search');
  };

  return (
    <div className="relative bg-gradient-to-br from-primary to-primary/80 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {user ? `Welcome back, ${user?.name?.split(' ')?.[0]}!` : 'Find Your Perfect Court'}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0">
            Discover and book premium sports facilities in your area. From tennis courts to basketball arenas, find the perfect venue for your game.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              variant="secondary"
              size="lg"
              iconName="MapPin"
              iconPosition="left"
              onClick={handleFindCourts}
              className="bg-white text-primary hover:bg-white/90"
            >
              Find Courts Near You
            </Button>
            
            {!user && (
              <Button
                variant="outline"
                size="lg"
                iconName="UserPlus"
                iconPosition="left"
                onClick={() => router.push('/login-registration')}
                className="border-white text-white hover:bg-white/10"
              >
                Join QuickCourt
              </Button>
            )}
          </div>
          
          <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-white/80">
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={16} />
              <span>500+ Venues</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} />
              <span>10,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Star" size={16} />
              <span>4.8 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;