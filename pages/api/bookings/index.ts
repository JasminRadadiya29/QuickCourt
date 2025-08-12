import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Court from '@/models/Court';
import Facility from '@/models/Facility';
import { requireAuth } from '@/lib/apiAuth';

function timesOverlap(startA: string, endA: string, startB: string, endB: string) {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const a1 = toMinutes(startA);
  const a2 = toMinutes(endA);
  const b1 = toMinutes(startB);
  const b2 = toMinutes(endB);
  return Math.max(a1, b1) < Math.min(a2, b2);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    // For public endpoints like recent bookings, we don't require auth
    const { user, venue, court, status, limit = '100', sort = '-createdAt' } = req.query as any;
    const filter: any = {};
    
    if (user) filter.user = user;
    if (venue) filter.venue = venue;
    if (court) filter.court = court;
    if (status) filter.status = status;
    
    try {
      const limitNum = parseInt(limit as string, 10) || 100;
      const sortOption = sort || '-createdAt';
      
      const bookings = await Booking.find(filter)
        .sort(sortOption)
        .limit(Math.min(limitNum, 100));
      
      console.log(`Retrieved ${bookings.length} bookings with filter:`, filter);
      return res.status(200).json({ data: bookings, total: bookings.length });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  if (req.method === 'POST') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    const { user, court, date, startHour, endHour, totalPrice } = req.body || {};
    if (!user || !court || !date || !startHour || !endHour || totalPrice == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (auth.userId !== user) return res.status(403).json({ error: 'Cannot create booking for another user' });

    const courtDoc = await Court.findById(court);
    if (!courtDoc) return res.status(404).json({ error: 'Court not found' });

    const venueId = courtDoc.venue;
    const venueDoc = await Facility.findById(venueId);
    if (!venueDoc) return res.status(404).json({ error: 'Venue not found' });

    // Check operating hours
    const withinHours = startHour >= (courtDoc.openHour || '06:00') && endHour <= (courtDoc.closeHour || '22:00');
    if (!withinHours) return res.status(400).json({ error: 'Outside operating hours' });

    // Overlap check
    const sameDayBookings = await Booking.find({ court, date, status: { $in: ['confirmed'] } });
    const hasOverlap = sameDayBookings.some(b => timesOverlap(startHour, endHour, b.startHour, b.endHour));
    if (hasOverlap) return res.status(409).json({ error: 'Time slot not available' });

    const newBooking = await Booking.create({
      user,
      venue: venueId,
      court,
      date,
      startHour,
      endHour,
      totalPrice,
      status: 'confirmed'
    });
    return res.status(201).json(newBooking);
  }

  return res.status(405).end();
}
