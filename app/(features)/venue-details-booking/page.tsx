"use client";
import React, { useEffect, useMemo, useState } from 'react';
import NavigationHeader from 'app/components/layout/NavigationHeader';
import VenueImageGallery from './components/VenueImageGallery';
import VenueInformation from './components/VenueInformation';
import ReviewsSection from './components/ReviewsSection';
import CourtBookingWidget from './components/CourtBookingWidget';
import Button from 'app/components/ui/Button';
import { apiFetch, getCurrentUser } from '@/lib/apiClient';

export default function VenueDetailsBooking() {
  const [isBookingWidgetVisible, setIsBookingWidgetVisible] = useState(false);
  const [venue, setVenue] = useState<any>(null);
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // naive: pick first approved venue for demo path without id routing wiring
    let cancelled = false;
    async function load() {
      const venues = await apiFetch('/api/facilities?approved=true&limit=1', { auth: false });
      if (cancelled) return;
      const v = venues?.data?.[0];
      setVenue(v);
      if (v) {
        const courtsRes = await apiFetch(`/api/courts?venue=${v._id}`, { auth: false });
        if (!cancelled) setCourts(courtsRes || []);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleBookingSubmit = async ({ court, date, timeSlot, total }) => {
    const user = getCurrentUser();
    if (!user) {
      alert('Please sign in');
      return;
    }
    setLoading(true);
    try {
      await apiFetch('/api/bookings', {
        method: 'POST',
        body: {
          user: user.id,
          court: court._id || court.id,
          date,
          startHour: timeSlot.time,
          endHour: `${parseInt(timeSlot.time.split(':')[0], 10) + 1}:00`,
          totalPrice: Math.round(total)
        }
      });
      window.location.href = '/user/bookings';
    } catch (e) {
      alert(e?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Example render when venue loaded */}
          {venue && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <VenueImageGallery images={venue.photos || []} />
                <VenueInformation venue={venue} />
                <ReviewsSection reviews={[]} />
              </div>
              <div className="lg:col-span-1">
                <CourtBookingWidget courts={courts} onBookingSubmit={handleBookingSubmit} />
                <Button className="mt-4" loading={loading}>Book Now</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
