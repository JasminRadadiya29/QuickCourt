import React from 'react';
import Icon from 'app/components/AppIcon';

const MapView = ({ venues, onVenueSelect, selectedVenue }) => {
  // Default coordinates - will be updated based on user location or venue data
  const mapCenter = { lat: 40.7128, lng: -74.0060 }; // Default to New York City

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-soft">
      <div className="relative h-96 lg:h-[600px]">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Venues Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=12&output=embed`}
          className="w-full h-full"
        />
        
        {/* Venue markers overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {venues?.slice(0, 10)?.map((venue, index) => (
            <div
              key={venue?.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${20 + (index % 5) * 15}%`,
                top: `${20 + Math.floor(index / 5) * 25}%`
              }}
            >
              <button
                onClick={() => onVenueSelect(venue)}
                className={`flex items-center justify-center w-8 h-8 rounded-full shadow-elevated transition-smooth ${
                  selectedVenue?.id === venue?.id
                    ? 'bg-primary text-primary-foreground scale-110'
                    : 'bg-card text-foreground hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                <Icon name="MapPin" size={16} />
              </button>
              
              {selectedVenue?.id === venue?.id && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg p-3 shadow-elevated min-w-48 z-10">
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    {venue?.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {typeof venue?.location === 'object' ? venue?.address : venue?.location}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      ${venue?.priceRange?.min} - ${venue?.priceRange?.max}/hr
                    </span>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={12} className="text-warning fill-current" />
                      <span className="text-muted-foreground">{venue?.rating}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-muted/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="MapPin" size={16} />
            <span>Showing {Math.min(venues?.length, 10)} venues on map</span>
          </div>
          <div className="text-muted-foreground">
            Click markers to view details
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;