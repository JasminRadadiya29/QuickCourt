import React from 'react';
import Icon from '../../../components/AppIcon';

const VenueInformation = ({ venue }) => {
  const sportIcons = {
    'Basketball': 'Circle',
    'Tennis': 'Circle',
    'Badminton': 'Circle',
    'Football': 'Circle',
    'Cricket': 'Circle',
    'Volleyball': 'Circle',
    'Table Tennis': 'Circle',
    'Squash': 'Circle'
  };

  return (
    <div className="space-y-6">
      {/* Venue Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {venue?.name}
        </h1>
        <div className="flex items-center space-x-4 text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={16} className="text-warning fill-current" />
            <span className="font-medium">{venue?.rating}</span>
            <span>({venue?.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={16} />
            <span>{venue?.location}</span>
          </div>
        </div>
      </div>
      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">About This Venue</h2>
        <p className="text-muted-foreground leading-relaxed">
          {venue?.description}
        </p>
      </div>
      {/* Address & Map */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Location</h2>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start space-x-3 mb-4">
            <Icon name="MapPin" size={20} className="text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{venue?.address}</p>
              <p className="text-sm text-muted-foreground">{venue?.city}, {venue?.state} {venue?.zipCode}</p>
            </div>
          </div>
          
          {/* Map */}
          <div className="w-full h-48 rounded-md overflow-hidden bg-muted">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title={venue?.name}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${venue?.coordinates?.lat},${venue?.coordinates?.lng}&z=14&output=embed`}
              className="border-0"
            />
          </div>
        </div>
      </div>
      {/* Available Sports */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Available Sports</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {venue?.sports?.map((sport, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-3 bg-card border border-border rounded-lg"
            >
              <Icon 
                name={sportIcons?.[sport] || 'Circle'} 
                size={20} 
                className="text-primary" 
              />
              <span className="text-sm font-medium text-foreground">{sport}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Amenities */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Amenities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {venue?.amenities?.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={16} className="text-success" />
              <span className="text-sm text-foreground">{amenity}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Operating Hours */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Operating Hours</h2>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {venue?.operatingHours?.map((schedule, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{schedule?.day}</span>
                <span className="text-sm text-muted-foreground">{schedule?.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueInformation;