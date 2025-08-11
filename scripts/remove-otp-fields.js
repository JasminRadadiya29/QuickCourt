// MongoDB Migration Script to Remove OTP Fields
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

// Remove OTP fields from users collection
const removeOtpFields = async () => {
  try {
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    console.log('Starting OTP fields removal...');
    
    // Update all users to remove otp and otpExpires fields
    const result = await usersCollection.updateMany(
      {}, // Update all documents
      {
        $unset: {
          otp: "",
          otpExpires: ""
        },
        $set: {
          isVerified: true // Set all users as verified
        }
      }
    );
    
    console.log(`Updated ${result.modifiedCount} users`);
    console.log('OTP fields removed successfully');
    
    // Verify the changes
    const usersWithOtp = await usersCollection.find({
      $or: [
        { otp: { $exists: true } },
        { otpExpires: { $exists: true } }
      ]
    }).count();
    
    console.log(`Users still with OTP fields: ${usersWithOtp}`);
    
    if (usersWithOtp === 0) {
      console.log('✅ All OTP fields have been successfully removed');
    } else {
      console.log('⚠️ Some users still have OTP fields');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to remove OTP fields:', error);
    return false;
  }
};

// Main migration function
const runMigration = async () => {
  const connected = await connectToDatabase();
  if (!connected) {
    console.error('Failed to connect to database');
    process.exit(1);
  }

  try {
    await removeOtpFields();
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
runMigration();
