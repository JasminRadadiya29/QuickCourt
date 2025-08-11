"use client";
import VenueDetailsBooking from '../../../../src/pages/venue-details-booking';

type Props = { params: { id: string } };

export default function VenueDetailPage({ params }: Props) {
  // Old page reads id from search params; we keep compatibility
  return <VenueDetailsBooking />;
}
