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

async function convertUnit(
  srcUnit: string,
  dstUnit: string,
  srcAmount: number
) {
  try {
    db.initDBConnection();
    const ratio = await db
      .getDBObject()
      .query('SELECT ratio FROM ?? WHERE sourceUnit=? AND destinationUnit=?', [
        db.UnitConversionTable,
        srcUnit,
        dstUnit,
      ]);
    return {
      dstAmount: (ratio[0].ratio as number) * srcAmount,
    };
  } catch (e) {
    console.error('unable to convert unit');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

async function convertUnits(payloads: any) {
  try {
    db.initDBConnection();
    const res = [];
    for (const payload of payloads) {
      const ratio = await db
        .getDBObject()
        .query(
          'SELECT ratio FROM ?? WHERE sourceUnit=? AND destinationUnit=?',
          [db.UnitConversionTable, payload.srcUnit, payload.dstUnit]
        );
      res.push((ratio[0].ratio as number) * payload.srcAmount);
    }
    return res;
  } catch (e) {
    console.error('unable to convert unit');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

const UnitService = {
  getUnits,
  convertUnit,
  convertUnits,
};

export default UnitService;
