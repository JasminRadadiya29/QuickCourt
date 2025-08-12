import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'app/components/AppImage';
import Button from 'app/components/ui/Button';
import Icon from 'app/components/AppIcon';
import { apiFetch } from 'lib/apiClient';

const FeaturedVenues = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredVenues, setFeaturedVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedVenues = async () => {
      try {
        setLoading(true);
        // Fetch facilities with approved status
        const response = await apiFetch('/api/facilities?approved=true&limit=4');
        
        if (response && response.data) {
          // For each facility, fetch its courts to get price ranges
          const venuesWithCourts = await Promise.all(response.data.map(async (facility) => {
            try {
              const courtsResponse = await apiFetch(`/api/courts?venue=${facility._id}`);
              const courts = courtsResponse?.data || [];
              
              // Calculate price range
              let minPrice = Infinity;
              let maxPrice = 0;
              
              courts.forEach(court => {
                if (court.pricePerHour < minPrice) minPrice = court.pricePerHour;
                if (court.pricePerHour > maxPrice) maxPrice = court.pricePerHour;
              });
              
              const priceRange = courts.length > 0 
                ? `₹${minPrice}-₹${maxPrice}/hour`
                : 'Price not available';
              
              // Use the first photo as the image or null if no photos
              const image = facility.photos && facility.photos.length > 0
                ? facility.photos[0]
                : null;
              
              // Extract binary image data if available
              const imageData = image.data ? image.data : null;
              const contentType = image.contentType ? image.contentType : null;
              
              return {
                id: facility._id,
                name: facility.name,
                image: typeof image === 'string' ? image : null,
                imageData: imageData,
                contentType: contentType,
                rating: facility.rating || 4.5,
                reviewCount: 0, // This would need to be calculated from reviews
                sports: facility.sports || [],
                priceRange: priceRange,
                location: facility.address,
                featured: true
              };
            } catch (error) {
              console.error('Error fetching courts for facility:', error);
              return null;
            }
          }));
          
          // Filter out any null values from failed requests
          setFeaturedVenues(venuesWithCourts.filter(venue => venue !== null));
        }
      } catch (error) {
        console.error('Error fetching featured venues:', error);
        setError('Failed to load featured venues');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedVenues();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, featuredVenues?.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, featuredVenues?.length - 2)) % Math.max(1, featuredVenues?.length - 2));
  };

  const handleVenueClick = (venueId) => {
    router.push(`/venue-details-booking?id=${venueId}`);
  };

  const handleViewAll = () => {
    router.push('/venues-listing-search');
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
          
          {!loading && featuredVenues.length > 3 && (
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
          )}
        </div>
        
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-10">
            <p className="text-error">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

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
                      imageData={venue?.imageData}
                      contentType={venue?.contentType}
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
                      <span>{typeof venue?.location === 'object' ? venue?.address : venue?.location}</span>
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
                      imageData={venue?.imageData}
                      contentType={venue?.contentType}
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
                      <span>{typeof venue?.location === 'object' ? venue?.address : venue?.location}</span>
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