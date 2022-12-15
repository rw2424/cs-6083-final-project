import db from '../db';
import InternalServerError from '../errors/internal-server-error';
import MainError from '../errors/main';

async function getUnits() {
  try {
    db.initDBConnection();
    const units = await db
      .getDBObject()
      .query('SELECT * FROM ??', [db.UnitTable]);
    return {
      units,
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

const UnitService = {
  getUnits,
};

export default UnitService;
