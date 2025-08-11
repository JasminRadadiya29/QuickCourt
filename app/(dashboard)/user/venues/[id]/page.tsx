"use client";
import VenueDetailsBooking from '../../../venue-details-booking/page';

type Props = { params: { id: string } };

export default function VenueDetailPage({ params }: Props) {
  // Old page reads id from search params; we keep compatibility
  return <VenueDetailsBooking />;
}
