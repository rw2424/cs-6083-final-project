import * as mysql from 'mysql2';
import * as util from 'util';

let query: any;
let poolInitialized = false;

const PersonTable = 'Person';
const RecipeTable = 'Recipe';
const UnitTable = 'Unit';
const RecipeIngredientTable = 'RecipeIngredient';
const RecipePictureTable = 'RecipePicture';
const StepTable = 'Step';
const IngredientTable = 'Ingredient';
const EventTable = 'Event';
const EventPictureTable = 'EventPicture';
const RSVP = 'RSVP';

const initDBConnection = () => {
  const poolWithoutPromise = mysql.createPool({
    connectionLimit: 10,
    host: process.env.dbHost,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    database: process.env.dbName,
  });
  query = util.promisify(poolWithoutPromise.query).bind(poolWithoutPromise);
  poolInitialized = true;
};

const getDBObject = () => {
  if (!poolInitialized) {
    throw Error('DB connection not established yet');
  }
  return {
    query,
  };
};

export default {
  initDBConnection,
  getDBObject,
  PersonTable,
  RecipeTable,
  UnitTable,
  RecipeIngredientTable,
  RecipePictureTable,
  StepTable,
  IngredientTable,
  EventTable,
  EventPictureTable,
  RSVP,
};
