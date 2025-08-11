import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import VenueImageGallery from './components/VenueImageGallery';
import VenueInformation from './components/VenueInformation';
import ReviewsSection from './components/ReviewsSection';
import CourtBookingWidget from './components/CourtBookingWidget';
import Button from '../../components/ui/Button';


const VenueDetailsBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const venueId = searchParams?.get('id') || '1';
  const [isBookingWidgetVisible, setIsBookingWidgetVisible] = useState(false);

  // Mock venue data
  const venue = {
    id: venueId,
    name: "Downtown Sports Complex",
    description: `Experience premium sports facilities at Downtown Sports Complex, the city's premier destination for recreational and competitive sports. Our state-of-the-art facility features multiple courts with professional-grade surfaces, modern lighting systems, and climate control for year-round comfort.\n\nWhether you're a casual player looking for a fun game with friends or a serious athlete preparing for competition, our facility provides the perfect environment. We pride ourselves on maintaining the highest standards of cleanliness and equipment quality.`,
    address: "123 Sports Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    location: "Downtown Manhattan",
    coordinates: {
      lat: 40.7589,
      lng: -73.9851
    },
    rating: 4.6,
    reviewCount: 284,
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
    ],
    sports: ["Basketball", "Tennis", "Badminton", "Volleyball"],
    amenities: [
      "Free Parking",
      "Locker Rooms",
      "Shower Facilities",
      "Equipment Rental",
      "Refreshment Area",
      "Air Conditioning",
      "Professional Lighting",
      "Sound System",
      "First Aid Station",
      "WiFi Access"
    ],
    operatingHours: [
      { day: "Monday", hours: "6:00 AM - 10:00 PM" },
      { day: "Tuesday", hours: "6:00 AM - 10:00 PM" },
      { day: "Wednesday", hours: "6:00 AM - 10:00 PM" },
      { day: "Thursday", hours: "6:00 AM - 10:00 PM" },
      { day: "Friday", hours: "6:00 AM - 11:00 PM" },
      { day: "Saturday", hours: "7:00 AM - 11:00 PM" },
      { day: "Sunday", hours: "7:00 AM - 9:00 PM" }
    ]
  };

  // Mock courts data
  const courts = [
    {
      id: 1,
      name: "Court A - Basketball",
      sport: "Basketball",
      hourlyRate: 45,
      operatingHours: "6:00 AM - 10:00 PM",
      isAvailable: true,
      features: ["Professional flooring", "Adjustable hoops", "Scoreboard"]
    },
    {
      id: 2,
      name: "Court B - Tennis",
      sport: "Tennis",
      hourlyRate: 35,
      operatingHours: "6:00 AM - 10:00 PM",
      isAvailable: true,
      features: ["Clay surface", "Professional nets", "Ball machine available"]
    },
    {
      id: 3,
      name: "Court C - Badminton",
      sport: "Badminton",
      hourlyRate: 25,
      operatingHours: "6:00 AM - 10:00 PM",
      isAvailable: false,
      features: ["Wooden flooring", "Professional nets", "Shuttle service"]
    },
    {
      id: 4,
      name: "Court D - Volleyball",
      sport: "Volleyball",
      hourlyRate: 40,
      operatingHours: "6:00 AM - 10:00 PM",
      isAvailable: true,
      features: ["Sand court", "Professional nets", "Beach volleyball setup"]
    }
  ];

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      userName: "Michael Johnson",
      userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      date: "2025-08-05",
      comment: "Excellent facility with top-notch courts and equipment. The staff is friendly and helpful. Booking process was smooth and the courts were exactly as described. Highly recommend for serious players!",
      helpfulCount: 12,
      images: []
    },
    {
      id: 2,
      userName: "Sarah Williams",
      userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
      date: "2025-08-03",
      comment: "Great courts and facilities. The only minor issue was that the air conditioning could be a bit stronger during peak summer hours. Overall, a fantastic place to play.",
      helpfulCount: 8,
      images: []
    },
    {
      id: 3,
      userName: "David Chen",
      userAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 5,
      date: "2025-07-28",
      comment: "Been coming here for months and it never disappoints. Clean facilities, well-maintained courts, and reasonable pricing. The online booking system is very convenient.",
      helpfulCount: 15,
      images: []
    },
    {
      id: 4,
      userName: "Emily Rodriguez",
      userAvatar: "https://randomuser.me/api/portraits/women/23.jpg",
      rating: 4,
      date: "2025-07-25",
      comment: "Good facility with modern amenities. The locker rooms are clean and spacious. Would love to see more time slots available during weekends.",
      helpfulCount: 6,
      images: []
    },
    {
      id: 5,
      userName: "James Thompson",
      userAvatar: "https://randomuser.me/api/portraits/men/89.jpg",
      rating: 5,
      date: "2025-07-20",
      comment: "Outstanding venue! The courts are professional grade and the equipment rental service is very convenient. Perfect for both casual games and serious training.",
      helpfulCount: 9,
      images: []
    }
  ];

  // Calculate rating distribution
  const ratingDistribution = reviews?.reduce((acc, review) => {
    acc[review.rating] = (acc?.[review?.rating] || 0) + 1;
    return acc;
  }, {});

  const overallRating = reviews?.reduce((sum, review) => sum + review?.rating, 0) / reviews?.length;

  const handleBookingSubmit = (bookingData) => {
    // Simulate booking success
    alert(`Booking confirmed!\nCourt: ${bookingData?.court?.name}\nDate: ${bookingData?.date}\nTime: ${bookingData?.timeSlot?.displayTime}\nTotal: $${bookingData?.total?.toFixed(2)}`);
    
    // Redirect to user bookings page
    navigate('/user-profile-my-bookings');
  };

  const handleWriteReview = () => {
    // Mock authentication check
    const isAuthenticated = true;
    
    if (!isAuthenticated) {
      navigate('/login-registration');
      return;
    }
    
    // Open review modal or navigate to review page
    alert('Review form would open here');
  };

  const toggleBookingWidget = () => {
    setIsBookingWidgetVisible(!isBookingWidgetVisible);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Booking CTA - Sticky */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-1030 bg-card border-t border-border p-4 shadow-elevated">
            <Button
              variant="default"
              fullWidth
              iconName="Calendar"
              iconPosition="left"
              onClick={toggleBookingWidget}
            >
              Book This Venue
            </Button>
          </div>

          {/* Back Navigation */}
          <div className="mb-6">
            <Button
              variant="ghost"
              iconName="ArrowLeft"
              iconPosition="left"
              onClick={() => navigate('/venues-listing-search')}
            >
              Back to Venues
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Image Gallery */}
              <VenueImageGallery 
                images={venue?.images} 
                venueName={venue?.name} 
              />

              {/* Venue Information */}
              <VenueInformation venue={venue} />

              {/* Reviews Section */}
              <ReviewsSection
                reviews={reviews}
                overallRating={overallRating}
                ratingDistribution={ratingDistribution}
                onWriteReview={handleWriteReview}
              />
            </div>

            {/* Booking Widget - Desktop Sidebar */}
            <div className="lg:col-span-4">
              <div className="hidden lg:block">
                <CourtBookingWidget
                  courts={courts}
                  onBookingSubmit={handleBookingSubmit}
                />
              </div>
            </div>
          </div>

          {/* Mobile Booking Widget Modal */}
          {isBookingWidgetVisible && (
            <div className="lg:hidden fixed inset-0 z-1040 bg-black/50 flex items-end">
              <div className="w-full bg-background rounded-t-lg max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Book This Venue</h3>
                  <Button
                    variant="ghost"
                    iconName="X"
                    onClick={toggleBookingWidget}
                  />
                </div>
                <div className="p-4 pb-20">
                  <CourtBookingWidget
                    courts={courts}
                    onBookingSubmit={(data) => {
                      handleBookingSubmit(data);
                      setIsBookingWidgetVisible(false);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Bottom Padding */}
          <div className="lg:hidden h-20" />
        </div>
      </main>
    </div>
  );
};

export default VenueDetailsBooking;