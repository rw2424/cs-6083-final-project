import type { NextApiRequest, NextApiResponse } from 'next';

import RecipeService from '../../../services/recipe-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == 'GET') {
      const { id } = req.query;
      const recipe = await RecipeService.getRecipeById(id);
      console.log(recipe);
      res.status(200).json(recipe);
    } else {
      res.status(405).json({});
    }
  } catch (error) {
    console.log(error);
    res.status((error as any).code).json(error);
  }
}
