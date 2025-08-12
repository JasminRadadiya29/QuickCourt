import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from 'app/components/AppIcon';
import { apiFetch } from 'lib/apiClient';

const PopularSports = () => {
  const router = useRouter();
  const [popularSports, setPopularSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define sport colors and icons mapping
  const sportStyles = {
    "Basketball": { icon: "Circle", color: "bg-orange-100 text-orange-600", hoverColor: "hover:bg-orange-200" },
    "Tennis": { icon: "Circle", color: "bg-green-100 text-green-600", hoverColor: "hover:bg-green-200" },
    "Badminton": { icon: "Zap", color: "bg-blue-100 text-blue-600", hoverColor: "hover:bg-blue-200" },
    "Football": { icon: "Circle", color: "bg-purple-100 text-purple-600", hoverColor: "hover:bg-purple-200" },
    "Volleyball": { icon: "Circle", color: "bg-red-100 text-red-600", hoverColor: "hover:bg-red-200" },
    "Squash": { icon: "Square", color: "bg-yellow-100 text-yellow-600", hoverColor: "hover:bg-yellow-200" },
    "Table Tennis": { icon: "Circle", color: "bg-indigo-100 text-indigo-600", hoverColor: "hover:bg-indigo-200" },
    "Cricket": { icon: "Circle", color: "bg-teal-100 text-teal-600", hoverColor: "hover:bg-teal-200" },
    // Default style for any other sport
    "default": { icon: "Circle", color: "bg-gray-100 text-gray-600", hoverColor: "hover:bg-gray-200" }
  };

  useEffect(() => {
    const fetchPopularSports = async () => {
      try {
        setLoading(true);
        // Fetch all courts to analyze sports
        const courtsResponse = await apiFetch('/api/courts');
        
        if (courtsResponse && courtsResponse.data) {
          // Count occurrences of each sport
          const sportCounts = {};
          
          courtsResponse.data.forEach(court => {
            if (court.sport) {
              if (!sportCounts[court.sport]) {
                sportCounts[court.sport] = 0;
              }
              sportCounts[court.sport]++;
            }
          });
          
          // Convert to array and sort by count
          const sportsArray = Object.entries(sportCounts).map(([name, count]) => {
            const style = sportStyles[name] || sportStyles.default;
            
            return {
              id: name,
              name: name,
              icon: style.icon,
              venueCount: count,
              color: style.color,
              hoverColor: style.hoverColor
            };
          });
          
          // Sort by venue count (descending)
          sportsArray.sort((a, b) => b.venueCount - a.venueCount);
          
          // Take top 8 sports
          setPopularSports(sportsArray.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching popular sports:', error);
        setError('Failed to load popular sports');
        
        // Fallback to default sports if API fails
        setPopularSports([
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
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPopularSports();
  }, []);

  const handleSportClick = (sportName) => {
    router.push(`/venues-listing-search?sport=${encodeURIComponent(sportName)}`);
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

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {error && !loading && popularSports.length === 0 && (
          <div className="text-center py-10">
            <p className="text-error">{error}</p>
          </div>
        )}

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
            onClick={() => router.push('/venues-listing-search')}
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