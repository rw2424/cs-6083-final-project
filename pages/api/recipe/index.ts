import type { NextApiRequest, NextApiResponse } from 'next';

import RecipeService from '../../../services/recipe-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == 'POST') {
      const {
        title,
        numServings,
        postedBy,
        ingredients,
        pictureUrls,
        stepDescriptions,
        tags,
      } = req.body;
      console.log(req.body);
      const recipe = await RecipeService.postRecipe(
        title,
        numServings,
        postedBy,
        ingredients,
        pictureUrls,
        stepDescriptions,
        tags
      );
      res.status(200).json(recipe);
    } else if (req.method == 'GET') {
      const recipes = await RecipeService.getRecipes();
      res.status(200).json(recipes);
    } else {
      res.status(405).json({});
    }
  } catch (error) {
    console.log(error);
    res.status((error as any).code).json(error);
  }
}
