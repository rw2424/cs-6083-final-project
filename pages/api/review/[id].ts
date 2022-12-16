import type { NextApiRequest, NextApiResponse } from 'next';

import ReviewService from '../../../services/review-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == 'GET') {
      const { id } = req.query;
      const review = await ReviewService.getReviewByRecipeId(id);
      res.status(200).json(review);
    } else {
      res.status(405).json({});
    }
  } catch (error) {
    console.log(error);
    res.status((error as any).code).json(error);
  }
}
