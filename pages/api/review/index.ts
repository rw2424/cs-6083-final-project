import type { NextApiRequest, NextApiResponse } from 'next';

import ReviewService from '../../../services/review-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == 'POST') {
      const { userName, recipeID, revTitle, revDesc, stars, pictureUrls } =
        req.body;
      const review = await ReviewService.postReview(
        userName,
        recipeID,
        revTitle,
        revDesc,
        stars,
        pictureUrls
      );
      res.status(200).json(review);
    } else {
      res.status(405).json({});
    }
  } catch (error) {
    console.log(error);
    res.status((error as any).code).json(error);
  }
}
