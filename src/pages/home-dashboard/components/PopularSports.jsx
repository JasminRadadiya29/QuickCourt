import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const PopularSports = () => {
  const navigate = useNavigate();

  const popularSports = [
    {
      id: 1,
      name: "Basketball",
      icon: "Circle",
      venueCount: 45,
      color: "bg-orange-100 text-orange-600",
      hoverColor: "hover:bg-orange-200"
    },
    {
      id: 2,
      name: "Tennis",
      icon: "Circle",
      venueCount: 38,
      color: "bg-green-100 text-green-600",
      hoverColor: "hover:bg-green-200"
    },
    {
      id: 3,
      name: "Badminton",
      icon: "Zap",
      venueCount: 52,
      color: "bg-blue-100 text-blue-600",
      hoverColor: "hover:bg-blue-200"
    },
    {
      id: 4,
      name: "Football",
      icon: "Circle",
      venueCount: 28,
      color: "bg-purple-100 text-purple-600",
      hoverColor: "hover:bg-purple-200"
    },
    {
      id: 5,
      name: "Volleyball",
      icon: "Circle",
      venueCount: 34,
      color: "bg-red-100 text-red-600",
      hoverColor: "hover:bg-red-200"
    },
    {
      id: 6,
      name: "Squash",
      icon: "Square",
      venueCount: 22,
      color: "bg-yellow-100 text-yellow-600",
      hoverColor: "hover:bg-yellow-200"
    },
    {
      id: 7,
      name: "Table Tennis",
      icon: "Circle",
      venueCount: 41,
      color: "bg-indigo-100 text-indigo-600",
      hoverColor: "hover:bg-indigo-200"
    },
    {
      id: 8,
      name: "Cricket",
      icon: "Circle",
      venueCount: 19,
      color: "bg-teal-100 text-teal-600",
      hoverColor: "hover:bg-teal-200"
    }
  ];

  const handleSportClick = (sportName) => {
    navigate(`/venues-listing-search?sport=${encodeURIComponent(sportName)}`);
  };

  return (
    <div className="bg-muted/30 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Popular Sports
          </h2>
          <p className="text-muted-foreground">
            Find venues for your favorite sports activities
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {popularSports?.map((sport) => (
            <div
              key={sport?.id}
              onClick={() => handleSportClick(sport?.name)}
              className={`bg-card border border-border rounded-lg p-4 text-center cursor-pointer transition-all hover:shadow-soft hover:scale-105 ${sport?.hoverColor}`}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${sport?.color}`}>
                <Icon name={sport?.icon} size={24} />
              </div>
              
              <h3 className="font-medium text-foreground text-sm mb-1">
                {sport?.name}
              </h3>
              
              <p className="text-xs text-muted-foreground">
                {sport?.venueCount} venues
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/venues-listing-search')}
            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
          >
            Explore All Sports →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopularSports;