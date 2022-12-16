import db from '../db';
import InternalServerError from '../errors/internal-server-error';
import MainError from '../errors/main';

export type Review = {
  iName: string;
  unitName: string;
  amount: number;
};

async function postReview(
  userName: string,
  recipeID: number,
  revTitle: string,
  revDesc: string,
  stars: number,
  pictureUrls: string[]
) {
  try {
    db.initDBConnection();
    const res = await db
      .getDBObject()
      .query(
        'INSERT into ?? (userName, recipeID, revTitle, revDesc, stars) values (?,?,?,?,?)',
        [db.ReviewTable, userName, recipeID, revTitle, revDesc, stars]
      );
    for (const pictureUrl of pictureUrls) {
      await db
        .getDBObject()
        .query(
          'INSERT into ?? (userName, recipeID, pictureURL) values (?,?,?)',
          [db.ReviewPictureTable, userName, recipeID, pictureUrl]
        );
    }
    return {
      res,
    };
  } catch (e) {
    console.error('Unable to post a review');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

async function getReviewByRecipeId(recipeId: number) {
  try {
    db.initDBConnection();
    const review = await db
      .getDBObject()
      .query('SELECT * FROM ?? WHERE recipeID=?', [db.ReviewTable, recipeId]);
    let res = [];
    for (const rev of review) {
      const pictureUrls = await db
        .getDBObject()
        .query('SELECT * FROM ?? WHERE recipeID=? AND userName=?', [
          db.ReviewPictureTable,
          recipeId,
          rev.userName,
        ]);
      res.push({
        ...rev,
        pictureUrls: pictureUrls.map((pu) => pu.pictureURL),
      });
    }
    return res;
  } catch (e) {
    console.error('unable to get review by id');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

const ReviewService = {
  postReview,
  getReviewByRecipeId,
};

export default ReviewService;
