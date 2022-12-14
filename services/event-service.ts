import db from '../db';
import InternalServerError from '../errors/internal-server-error';
import MainError from '../errors/main';

async function postEvent(
  eName: string,
  eDesc: string,
  eDate: string,
  gName: string,
  gCreator: string,
  pictureUrls: string[]
) {
  try {
    db.initDBConnection();
    const res = await db
      .getDBObject()
      .query(
        'INSERT into ?? (eName, eDesc, eDate, gName, gCreator) values (?,?,?,?,?)',
        [db.EventTable, eName, eDesc, eDate, gName, gCreator]
      );
    const eventId = res.insertId;
    for (const pictureUrl of pictureUrls) {
      await db
        .getDBObject()
        .query('INSERT into ?? (eID, pictureURL) values (?,?)', [
          db.EventPictureTable,
          eventId,
          pictureUrl,
        ]);
    }
    return {
      eventId,
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

async function getEvents(gName: string, gCreator: string) {
  try {
    db.initDBConnection();
    let eventInfos = Array();
    const events = await db
      .getDBObject()
      .query('SELECT * FROM ?? WHERE gName=? AND gCreator=?', [
        db.EventTable,
        gName,
        gCreator,
      ]);
    for (const event of events) {
      const pictures = await db
        .getDBObject()
        .query('SELECT * FROM ?? WHERE eID=?', [
          db.EventPictureTable,
          event.eID,
        ]);
      eventInfos.push({
        eID: event.eID,
        eName: event.eName,
        eDesc: event.eDesc,
        eDate: event.eDate,
        picture: pictures.map((p) => p.pictureURL),
      });
    }
    return eventInfos;
  } catch (e) {
    console.error('unable to get events');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

async function getEventById(id: number) {
  try {
    db.initDBConnection();
    const event = await db
      .getDBObject()
      .query('SELECT * FROM ?? WHERE eID=?', [db.EventTable, id]);
    return {
      event: event,
    };
  } catch (e) {
    console.error('unable to get event by id');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

const EventService = {
  postEvent,
  getEvents,
  getEventById,
};

export default EventService;
