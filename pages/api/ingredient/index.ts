import type { NextApiRequest, NextApiResponse } from 'next';

import IngredientService from '../../../services/ingredient-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == 'GET') {
      const ingredients = await IngredientService.getIngredients();
      res.status(200).json(ingredients);
    } else {
      res.status(405).json({});
    }
  } catch (error) {
    console.log(error);
    res.status((error as any).code).json(error);
  }
}
