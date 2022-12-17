import db from '../db';
import InternalServerError from '../errors/internal-server-error';
import MainError from '../errors/main';
import GroupService from './group-service';

async function addRSVP(
  userName: string,
  eID: string,
  response: string,
  gName: string,
  gCreator: string
) {
  try {
    const isInGroup = await GroupService.inGroup(userName, gName, gCreator);
    if (!isInGroup.isIn) {
      return {
        error: 1,
      };
    }
    db.initDBConnection();
    const res = await db
      .getDBObject()
      .query('INSERT into ?? (userName, eID, response) values (?,?,?)', [
        db.RSVP,
        userName,
        eID,
        response,
      ]);
    return {
      userName,
      eID,
    };
  } catch (e) {
    console.error('Unable to post an event');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

async function getRSVP() {
  try {
    db.initDBConnection();
    let rsvpInfos = [];
    const rsvps = await db.getDBObject().query('SELECT * FROM ??', [db.RSVP]);
    for (const rsvp of rsvps) {
      rsvpInfos.push({
        userName: rsvp.userName,
        eID: rsvp.eID,
        response: rsvp.response,
      });
    }

    return rsvpInfos;
  } catch (e) {
    console.error('unable to get rsvps');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

async function cancelRSVP(userName: string, eID: number) {
  try {
    db.initDBConnection();
    const rsvps = await db
      .getDBObject()
      .query('DELETE FROM ?? WHERE userName=? AND eID=?', [
        db.RSVP,
        userName,
        eID,
      ]);
    return rsvps;
  } catch (e) {
    console.error('unable to get rsvps');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

async function inRSVP(userName: string, eID: number) {
  try {
    db.initDBConnection();
    const rsvp = await db
      .getDBObject()
      .query('SELECT * FROM ?? WHERE userName=? AND eID=?', [
        db.RSVP,
        userName,
        eID,
      ]);
    return {
      isIn: rsvp.length > 0,
    };
  } catch (e) {
    console.error('unable to join event');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

const RSVPService = {
  addRSVP,
  getRSVP,
  cancelRSVP,
  inRSVP,
};

export default RSVPService;
