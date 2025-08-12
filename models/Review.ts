import mongoose, { Schema, models, model } from 'mongoose';

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  facilityId: { type: Schema.Types.ObjectId, ref: 'Facility', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  images: [{ 
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true }
  }] // Array of images stored as binary data
}, { timestamps: true });

// Middleware to update facility rating when a review is saved or updated
ReviewSchema.post('save', async function() {
  const Review = this.constructor;
  const Facility = mongoose.model('Facility');
  
  // Calculate average rating for the facility
  const result = await (Review as any).aggregate([
    { $match: { facilityId: this.facilityId } },
    { $group: { _id: '$facilityId', avgRating: { $avg: '$rating' } } }
  ]);
  
  if (result.length > 0) {
    // Update the facility with the new average rating
    await Facility.findByIdAndUpdate(this.facilityId, {
      rating: parseFloat(result[0].avgRating.toFixed(1))
    });
  }
});

// Also update facility rating when a review is removed
ReviewSchema.post('deleteOne', async function() {
  const Review = this.constructor;
  const Facility = mongoose.model('Facility');
  
  // Calculate average rating for the facility
  const result = await (Review as any).aggregate([
    { $match: { facilityId: (this as any).facilityId } },
    { $group: { _id: '$facilityId', avgRating: { $avg: '$rating' } } }
  ]);
  
  // If there are no reviews left, set rating to 0, otherwise update with average
  const newRating = result.length > 0 ? parseFloat(result[0].avgRating.toFixed(1)) : 0;
  await Facility.findByIdAndUpdate((this as any).facilityId, { rating: newRating });
});

export default models.Review || model('Review', ReviewSchema);
