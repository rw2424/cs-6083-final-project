import db from '../db';
import InternalServerError from '../errors/internal-server-error';
import MainError from '../errors/main';

export type Ingredient = {
  iName: string;
  unitName: string;
  amount: number;
};

async function postRecipe(
  title: string,
  numServings: number,
  postedBy: string,
  ingredients: Ingredient[],
  pictureUrls: string[],
  stepDescriptions: string[]
) {
  try {
    db.initDBConnection();
    const res = await db
      .getDBObject()
      .query('INSERT into ?? (title, numServings, postedBy) values (?,?,?)', [
        db.RecipeTable,
        title,
        numServings,
        postedBy,
      ]);
    const recipeId = res.insertId;
    for (const ingredient of ingredients) {
      await db
        .getDBObject()
        .query(
          'INSERT into ?? (recipeID, iName, unitName, amount) values (?,?,?,?)',
          [
            db.RecipeIngredientTable,
            recipeId,
            ingredient.iName,
            ingredient.unitName,
            ingredient.amount,
          ]
        );
    }
    for (const pictureUrl of pictureUrls) {
      await db
        .getDBObject()
        .query('INSERT into ?? (recipeID, pictureURL) values (?,?)', [
          db.RecipePictureTable,
          recipeId,
          pictureUrl,
        ]);
    }
    for (let i = 0; i < stepDescriptions.length; i++) {
      await db
        .getDBObject()
        .query('INSERT into ?? (stepNo, recipeID, sDesc) values (?,?,?)', [
          db.StepTable,
          i + 1,
          recipeId,
          stepDescriptions[i],
        ]);
    }
    return {
      recipeId,
    };
  } catch (e) {
    console.error('Unable to post a recipe');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

async function getRecipes() {
  try {
    db.initDBConnection();
    let recipeInfos = [];
    const recipes = await db
      .getDBObject()
      .query('SELECT * FROM ??', [db.RecipeTable]);
    for (const recipe of recipes) {
      const pictures = await db
        .getDBObject()
        .query('SELECT * FROM ?? WHERE recipeID=?', [
          db.RecipePictureTable,
          recipe.recipeID,
        ]);
      recipeInfos.push({
        recipeId: recipe.recipeID,
        title: recipe.title,
        pictureUrl: pictures[0].pictureURL,
      });
    }
    return recipeInfos;
  } catch (e) {
    console.error('unable to get recipes');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

async function getRecipeById(id: number) {
  try {
    db.initDBConnection();
    const recipe = await db
      .getDBObject()
      .query('SELECT * FROM ?? WHERE recipeID=?', [db.RecipeTable, id]);
    const ingredients = await db
      .getDBObject()
      .query('SELECT * FROM ?? WHERE recipeID=?', [
        db.RecipeIngredientTable,
        id,
      ]);
    const pictures = await db
      .getDBObject()
      .query('SELECT * FROM ?? WHERE recipeID=?', [db.RecipePictureTable, id]);
    const steps = await db
      .getDBObject()
      .query('SELECT * FROM ?? WHERE recipeID=?', [db.StepTable, id]);
    return {
      recipe: recipe,
      ingredients: ingredients,
      pictures: pictures,
      steps: steps,
    };
  } catch (e) {
    console.error('unable to get recipe by id');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

const RecipeService = {
  postRecipe,
  getRecipes,
  getRecipeById,
};

export default RecipeService;
