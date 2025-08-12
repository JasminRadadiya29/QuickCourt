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

function generateTimeSlots(openHour: string, closeHour: string) {
  const slots = [];
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  
  const startMinutes = toMinutes(openHour);
  const endMinutes = toMinutes(closeHour);
  
  // Generate hourly slots
  for (let minutes = startMinutes; minutes < endMinutes; minutes += 60) {
    const hour = Math.floor(minutes / 60);
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    slots.push({ start: startTime, end: endTime });
  }
  
  return slots;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    const { venueId, date } = req.body;
    
    if (!venueId || !date) {
      return res.status(400).json({ error: 'Venue ID and date are required' });
    }
    
    // Fetch all courts for the given venue
    const courts = await Court.find({ venue: venueId, isAvailable: true });
    
    if (!courts.length) {
      return res.status(404).json({ error: 'No available courts found for this venue' });
    }
    
    // Fetch all confirmed bookings for the same date
    const bookings = await Booking.find({
      venue: venueId,
      date,
      status: 'confirmed'
    });
    
    // Prepare response with available time slots for each court
    const courtsWithAvailability = await Promise.all(courts.map(async (court) => {
      // Generate all possible time slots based on court operating hours
      const allTimeSlots = generateTimeSlots(court.openHour || '06:00', court.closeHour || '22:00');
      
      // Filter out booked slots
      const courtBookings = bookings.filter(booking => booking.court.toString() === court._id.toString());
      
      const availableSlots = allTimeSlots.filter(slot => {
        return !courtBookings.some(booking => 
          timesOverlap(slot.start, slot.end, booking.startHour, booking.endHour)
        );
      });
      
      return {
        courtId: court._id.toString(),
        name: court.name,
        sport: court.sport,
        pricePerHour: court.pricePerHour,
        availableSlots: availableSlots.map(slot => `${slot.start}-${slot.end}`)
      };
    }));
    
    return res.status(200).json({ courts: courtsWithAvailability });
  } catch (error) {
    console.error('Error checking court availability:', error);
    return res.status(500).json({ error: 'Failed to check court availability' });
  }
}