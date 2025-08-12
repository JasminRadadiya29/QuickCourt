import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';
import { requireAuth } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    try {
      const review = await Review.findById(id).populate('userId', 'name avatar');
      if (!review) return res.status(404).json({ error: 'Review not found' });
      return res.status(200).json(review);
    } catch (error) {
      console.error('Error fetching review:', error);
      return res.status(500).json({ error: 'Failed to fetch review' });
    }
  }

  if (req.method === 'PUT') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    
    try {
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ error: 'Review not found' });
      
      // Only allow users to update their own reviews
      if (review.userId.toString() !== auth.userId) {
        return res.status(403).json({ error: 'You can only update your own reviews' });
      }
      
      const { rating, comment, images } = req.body || {};
      
      // Validate rating if provided
      if (rating !== undefined && (rating < 1 || rating > 5)) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      
      // Update the review using save() to trigger the post('save') middleware
      if (rating !== undefined) review.rating = rating;
      if (comment !== undefined) review.comment = comment;
      if (images !== undefined) review.images = images;
      
      await review.save();
      const updatedReview = review;
      
      return res.status(200).json(updatedReview);
    } catch (error) {
      console.error('Error updating review:', error);
      return res.status(500).json({ error: 'Failed to update review' });
    }
  }

  if (req.method === 'DELETE') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    
    try {
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ error: 'Review not found' });
      
      // Only allow users to delete their own reviews
      if (review.userId.toString() !== auth.userId) {
        return res.status(403).json({ error: 'You can only delete your own reviews' });
      }
      
      // Use remove() instead of findByIdAndDelete() to trigger the post('remove') middleware
      await review.remove();
      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting review:', error);
      return res.status(500).json({ error: 'Failed to delete review' });
    }
  }

  return res.status(405).end();
}