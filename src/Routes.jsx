import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import HomeDashboard from './pages/home-dashboard';
import VenuesListingSearch from './pages/venues-listing-search';
import LoginRegistration from './pages/login-registration';
import FacilityOwnerDashboard from './pages/facility-owner-dashboard';
import VenueDetailsBooking from './pages/venue-details-booking';
import UserProfileMyBookings from './pages/user-profile-my-bookings';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<FacilityOwnerDashboard />} />
        <Route path="/home-dashboard" element={<HomeDashboard />} />
        <Route path="/venues-listing-search" element={<VenuesListingSearch />} />
        <Route path="/login-registration" element={<LoginRegistration />} />
        <Route path="/facility-owner-dashboard" element={<FacilityOwnerDashboard />} />
        <Route path="/venue-details-booking" element={<VenueDetailsBooking />} />
        <Route path="/user-profile-my-bookings" element={<UserProfileMyBookings />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
