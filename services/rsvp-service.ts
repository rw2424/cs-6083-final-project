import db from '../db';
import InternalServerError from '../errors/internal-server-error';
import MainError from '../errors/main';


async function postRSVP(
  userName: string,
  eID: string,
  response: string,
) {
  try {
    db.initDBConnection();
    const res = await db
      .getDBObject()
      .query('INSERT into ?? (userName, eID, response) values (?,?,?)', [
        db.RSVP,
        userName,
        eID,
        response
      ]);
    return {
      userName, eID
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
      const rsvps = await db
        .getDBObject()
        .query('SELECT * FROM ??', [db.RSVP]);
    for(const rsvp of rsvps)
    {
        rsvpInfos.push({
            userName: rsvp.userName,
            eID: rsvp.eID,
            response: rsvp.response
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

const RSVPService = {
  postRSVP,
  getRSVP
};

export default RSVPService;
