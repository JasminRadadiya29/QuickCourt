import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';
import Facility from '@/models/Facility';
import { requireAuth } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const { facilityId, userId } = req.query as any;
    const filter: any = {};
    
    if (facilityId) filter.facilityId = facilityId;
    if (userId) filter.userId = userId;
    
    try {
      const reviews = await Review.find(filter)
        .sort({ createdAt: -1 })
        .populate('userId', 'name avatar') // Populate user details
        .limit(100);
      
      return res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }

  if (req.method === 'POST') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    
    const { facilityId, rating, comment, images } = req.body || {};
    
    if (!facilityId || rating == null) {
      return res.status(400).json({ error: 'facilityId and rating are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    try {
      // Check if facility exists
      const facility = await Facility.findById(facilityId);
      if (!facility) {
        return res.status(404).json({ error: 'Facility not found' });
      }
      
      // Check if user already reviewed this facility
      const existingReview = await Review.findOne({
        userId: auth.userId,
        facilityId
      });
      
      if (existingReview) {
        return res.status(409).json({ error: 'You have already reviewed this facility' });
      }
      
      // Process images if they exist
      let processedImages = [];
      if (images && Array.isArray(images)) {
        processedImages = images.map(image => {
          // Check if image is already in the correct format
          if (image.data && image.contentType) {
            return image;
          }
          
          // If it's a base64 string, convert it to Buffer
          if (typeof image === 'string' && image.includes('base64')) {
            const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              const contentType = matches[1];
              const buffer = Buffer.from(matches[2], 'base64');
              return { data: buffer, contentType };
            }
          }
          
          return null;
        }).filter(image => image !== null);
      }
      
      const review = await Review.create({
        userId: auth.userId,
        facilityId,
        rating,
        comment,
        images: processedImages
      });
      
      return res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      return res.status(500).json({ error: 'Failed to create review' });
    }
  }

  return res.status(405).end();
}