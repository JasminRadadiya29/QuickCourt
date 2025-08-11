import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { formatINR } from '../../../utils/currency';

const VenueCard = ({ venue }) => {
  const [isFavorite, setIsFavorite] = useState(venue?.isFavorite || false);

  const handleFavoriteToggle = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={16} className="text-warning fill-current opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  const getSportIcon = (sport) => {
    const sportIcons = {
      basketball: 'Circle',
      tennis: 'Circle',
      badminton: 'Circle',
      football: 'Circle',
      volleyball: 'Circle',
      swimming: 'Waves',
      cricket: 'Circle',
      squash: 'Square'
    };
    return sportIcons?.[sport] || 'Circle';
  };

  return (
    <Link to="/venue-details-booking" className="block group">
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-smooth">
        <div className="relative">
          <div className="aspect-video overflow-hidden">
            <Image
              src={venue?.image}
              alt={venue?.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-smooth"
          >
            <Icon 
              name="Heart" 
              size={18} 
              className={isFavorite ? "text-red-500 fill-current" : "text-muted-foreground"}
            />
          </button>

          {venue?.isNew && (
            <div className="absolute top-3 left-3 bg-success text-success-foreground px-2 py-1 rounded-md text-xs font-medium">
              New
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth line-clamp-1">
              {venue?.name}
            </h3>
            <div className="flex items-center gap-1 ml-2">
              {renderStars(venue?.rating)}
              <span className="text-sm text-muted-foreground ml-1">
                ({venue?.reviewCount})
              </span>
            </div>
          </div>

          <div className="flex items-center text-muted-foreground mb-3">
            <Icon name="MapPin" size={16} className="mr-1" />
            <span className="text-sm line-clamp-1">{venue?.location}</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            {venue?.sports?.slice(0, 4)?.map((sport, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"
              >
                <Icon name={getSportIcon(sport)} size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground capitalize">{sport}</span>
              </div>
            ))}
            {venue?.sports?.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{venue?.sports?.length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {venue?.openHours}
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">
                {formatINR(venue?.priceRange?.min)} - {formatINR(venue?.priceRange?.max)}
              </div>
              <div className="text-xs text-muted-foreground">per hour</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" fullWidth>
              View Details
            </Button>
            <Button size="sm" fullWidth>
              Quick Book
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VenueCard;