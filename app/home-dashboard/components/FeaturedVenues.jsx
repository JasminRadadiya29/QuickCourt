import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from 'app/components/AppImage';
import Button from 'app/components/ui/Button';
import Icon from 'app/components/AppIcon';

const FeaturedVenues = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredVenues = [
    {
      id: 1,
      name: "Downtown Sports Complex",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      rating: 4.8,
      reviewCount: 124,
      sports: ["Basketball", "Tennis", "Badminton"],
      priceRange: "$25-45/hour",
      location: "Downtown District",
      featured: true
    },
    {
      id: 2,
      name: "Elite Tennis Academy",
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=600&fit=crop",
      rating: 4.9,
      reviewCount: 89,
      sports: ["Tennis", "Squash"],
      priceRange: "$30-60/hour",
      location: "Uptown Area",
      featured: true
    },
    {
      id: 3,
      name: "Community Recreation Center",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&h=600&fit=crop",
      rating: 4.6,
      reviewCount: 156,
      sports: ["Basketball", "Volleyball", "Badminton"],
      priceRange: "$20-35/hour",
      location: "Westside",
      featured: true
    },
    {
      id: 4,
      name: "Premier Fitness Courts",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop",
      rating: 4.7,
      reviewCount: 92,
      sports: ["Tennis", "Basketball"],
      priceRange: "$35-55/hour",
      location: "Business District",
      featured: true
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, featuredVenues?.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, featuredVenues?.length - 2)) % Math.max(1, featuredVenues?.length - 2));
  };

  const handleVenueClick = (venueId) => {
    navigate(`/venue-details-booking?id=${venueId}`);
  };

  const handleViewAll = () => {
    navigate('/venues-listing-search');
  };

  return (
    <div className="bg-background py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Featured Venues
            </h2>
            <p className="text-muted-foreground">
              Discover top-rated sports facilities in your area
            </p>
          </div>
          
          <div className="hidden lg:flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <Icon name="ChevronLeft" size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={currentSlide >= featuredVenues?.length - 3}
            >
              <Icon name="ChevronRight" size={20} />
            </Button>
          </div>
        </div>

        {/* Desktop Carousel */}
        <div className="hidden lg:block overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
          >
            {featuredVenues?.map((venue) => (
              <div key={venue?.id} className="w-1/3 flex-shrink-0 px-3">
                <div 
                  className="bg-card rounded-lg shadow-soft border border-border overflow-hidden cursor-pointer hover:shadow-elevated transition-shadow"
                  onClick={() => handleVenueClick(venue?.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={venue?.image}
                      alt={venue?.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{venue?.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 truncate">
                      {venue?.name}
                    </h3>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                      <Icon name="MapPin" size={14} />
                      <span>{venue?.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {venue?.sports?.slice(0, 2)?.map((sport, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                        >
                          {sport}
                        </span>
                      ))}
                      {venue?.sports?.length > 2 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +{venue?.sports?.length - 2}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {venue?.priceRange}
                      </span>
                      <Button variant="outline" size="sm">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Scroll */}
        <div className="lg:hidden">
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {featuredVenues?.map((venue) => (
              <div key={venue?.id} className="flex-shrink-0 w-72">
                <div 
                  className="bg-card rounded-lg shadow-soft border border-border overflow-hidden cursor-pointer"
                  onClick={() => handleVenueClick(venue?.id)}
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={venue?.image}
                      alt={venue?.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{venue?.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">
                      {venue?.name}
                    </h3>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                      <Icon name="MapPin" size={14} />
                      <span>{venue?.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {venue?.sports?.slice(0, 2)?.map((sport, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {venue?.priceRange}
                      </span>
                      <Button variant="outline" size="sm">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" onClick={handleViewAll}>
            View All Venues
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedVenues;