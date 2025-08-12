// MongoDB Seed Script
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Connect to MongoDB Atlas
const connectToDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in .env.local file');
      console.error('Please add your MongoDB Atlas connection string to .env.local');
      return false;
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error);
    return false;
  }
};

// Seed Users
const seedUsers = async () => {
  const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'facility_owner', 'admin'], default: 'user' },
    avatar: { type: String },
    status: { type: String, enum: ['active', 'banned'], default: 'active' }
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  try {
    // Clear existing users
    await User.deleteMany({});

    // Create users
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hashedpassword123',
        role: 'user',
        status: 'active'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: 'hashedpassword456',
        role: 'facility_owner',
        status: 'active'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: 'hashedpassword789',
        role: 'admin',
        status: 'active'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    return createdUsers;
  } catch (error) {
    console.error('Failed to seed users:', error);
    return [];
  }
};

// Seed Facilities
const seedFacilities = async (users) => {
  const FacilitySchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    sports: [{ type: String }],
    amenities: [{ type: String }],
    photos: [{ type: String }],
    rating: { type: Number, default: 0 },
    approved: { type: Boolean, default: false },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    }
  }, { timestamps: true });

  FacilitySchema.index({ location: '2dsphere' });

  const Facility = mongoose.models.Facility || mongoose.model('Facility', FacilitySchema);

  try {
    // Clear existing facilities
    await Facility.deleteMany({});

    // Find facility owner
    const owner = users.find(user => user.role === 'facility_owner');

    if (!owner) {
      console.error('No facility owner found');
      return [];
    }

    // Create facilities
    const facilities = [
      {
        owner: owner._id,
        name: 'Downtown Sports Center',
        description: 'A premium sports facility in the heart of downtown',
        address: '123 Main St, Downtown',
        sports: ['Tennis', 'Basketball', 'Volleyball'],
        amenities: ['Parking', 'Changing Rooms', 'Cafe'],
        photos: ['/assets/images/facility1.jpg'],
        rating: 4.5,
        approved: true,
        location: {
          type: 'Point',
          coordinates: [-73.9857, 40.7484]
        }
      },
      {
        owner: owner._id,
        name: 'Riverside Courts',
        description: 'Beautiful courts with a view of the river',
        address: '456 River Rd, Riverside',
        sports: ['Tennis', 'Badminton'],
        amenities: ['Parking', 'Pro Shop', 'Lounge'],
        photos: ['/assets/images/facility2.jpg'],
        rating: 4.2,
        approved: true,
        location: {
          type: 'Point',
          coordinates: [-73.9654, 40.7829]
        }
      }
    ];

    const createdFacilities = await Facility.insertMany(facilities);
    console.log(`${createdFacilities.length} facilities created`);
    return createdFacilities;
  } catch (error) {
    console.error('Failed to seed facilities:', error);
    return [];
  }
};

// Seed Courts
const seedCourts = async (facilities) => {
  const CourtSchema = new mongoose.Schema({
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    name: { type: String, required: true },
    sport: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    openHour: { type: Number, required: true },
    closeHour: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    features: [{ type: String }]
  });

  const Court = mongoose.models.Court || mongoose.model('Court', CourtSchema);

  try {
    // Clear existing courts
    await Court.deleteMany({});

    if (facilities.length === 0) {
      console.error('No facilities found');
      return [];
    }

    // Create courts for each facility
    let courts = [];

    for (const facility of facilities) {
      const facilityCourts = [
        {
          venue: facility._id,
          name: 'Court A',
          sport: facility.sports[0] || 'Tennis',
          pricePerHour: 50,
          openHour: 8,
          closeHour: 22,
          isAvailable: true,
          features: ['Lighting', 'Professional Surface']
        },
        {
          venue: facility._id,
          name: 'Court B',
          sport: facility.sports[0] || 'Tennis',
          pricePerHour: 45,
          openHour: 8,
          closeHour: 22,
          isAvailable: true,
          features: ['Lighting']
        }
      ];

      courts = [...courts, ...facilityCourts];
    }

    const createdCourts = await Court.insertMany(courts);
    console.log(`${createdCourts.length} courts created`);
    return createdCourts;
  } catch (error) {
    console.error('Failed to seed courts:', error);
    return [];
  }
};

// Seed Bookings
const seedBookings = async (users, facilities, courts) => {
  const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
    date: { type: Date, required: true },
    startHour: { type: Number, required: true },
    endHour: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' }
  }, { timestamps: true });

  BookingSchema.index({ court: 1, date: 1, startHour: 1, endHour: 1 });

  const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

  try {
    // Clear existing bookings
    await Booking.deleteMany({});

    if (users.length === 0 || facilities.length === 0 || courts.length === 0) {
      console.error('Missing users, facilities, or courts');
      return [];
    }

    const regularUser = users.find(user => user.role === 'user');
    const owner = users.find(user => user.role === 'facility_owner');

    if (!regularUser || !owner) {
      console.error('Missing regular user or facility owner');
      return [];
    }

    // Create bookings
    const bookings = [];

    // Past bookings
    for (let i = 1; i <= 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const court = courts[i % courts.length];
      const facility = facilities.find(f => f._id.toString() === court.venue.toString());

      bookings.push({
        user: regularUser._id,
        venue: facility._id,
        court: court._id,
        date: date,
        startHour: 10 + (i % 8),
        endHour: 11 + (i % 8),
        totalPrice: court.pricePerHour,
        status: 'confirmed'
      });
    }

    // Upcoming bookings
    for (let i = 1; i <= 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const court = courts[i % courts.length];
      const facility = facilities.find(f => f._id.toString() === court.venue.toString());

      bookings.push({
        user: regularUser._id,
        venue: facility._id,
        court: court._id,
        date: date,
        startHour: 14 + (i % 6),
        endHour: 15 + (i % 6),
        totalPrice: court.pricePerHour,
        status: 'confirmed'
      });
    }

    const createdBookings = await Booking.insertMany(bookings);
    console.log(`${createdBookings.length} bookings created`);
    return createdBookings;
  } catch (error) {
    console.error('Failed to seed bookings:', error);
    return [];
  }
};

// Seed Reviews
const seedReviews = async (users, facilities) => {
  const ReviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
  }, { timestamps: true });

  const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

  try {
    // Clear existing reviews
    await Review.deleteMany({});

    if (users.length === 0 || facilities.length === 0) {
      console.error('Missing users or facilities');
      return [];
    }

    const regularUser = users.find(user => user.role === 'user');

    if (!regularUser) {
      console.error('No regular user found');
      return [];
    }

    // Create reviews
    const reviews = [];

    for (const facility of facilities) {
      reviews.push({
        userId: regularUser._id,
        facilityId: facility._id,
        rating: 4 + Math.floor(Math.random() * 2),
        comment: 'Great facility with excellent courts and amenities!'
      });
    }

    const createdReviews = await Review.insertMany(reviews);
    console.log(`${createdReviews.length} reviews created`);
    return createdReviews;
  } catch (error) {
    console.error('Failed to seed reviews:', error);
    return [];
  }
};

// Main seed function
const seedDatabase = async () => {
  const connected = await connectToDatabase();
  if (!connected) {
    console.error('Failed to connect to database');
    process.exit(1);
  }

  try {
    const users = await seedUsers();
    const facilities = await seedFacilities(users);
    const courts = await seedCourts(facilities);
    await seedBookings(users, facilities, courts);
    await seedReviews(users, facilities);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();