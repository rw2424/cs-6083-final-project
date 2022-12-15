import db from '../db';
import InternalServerError from '../errors/internal-server-error';
import MainError from '../errors/main';

async function getIngredients() {
  try {
    db.initDBConnection();
    const ingredients = await db
      .getDBObject()
      .query('SELECT * FROM ??', [db.IngredientTable]);
    return {
      ingredients,
    };
  } catch (e) {
    console.error('unable to get units');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

const IngredientService = {
  getIngredients,
};

export default IngredientService;
