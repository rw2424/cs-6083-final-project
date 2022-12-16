import db from '../db';
import InternalServerError from '../errors/internal-server-error';
import MainError from '../errors/main';

async function getGroups() {
  try {
    db.initDBConnection();
    const groups = await db
      .getDBObject()
      .query('SELECT * FROM ??', [db.GroupTable]);
    return groups;
  } catch (e) {
    console.error('unable to get groups');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

async function joinGroup(userName: string, gName: string, gCreator: string) {
  try {
    db.initDBConnection();
    const event = await db
      .getDBObject()
      .query('INSERT INTO ?? (memberName,gName,gCreator) VALUES (?,?,?)', [
        db.GroupMembershipTable,
        userName,
        gName,
        gCreator,
      ]);
    return {
      event,
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

const GroupService = {
  getGroups,
  joinGroup,
};

export default GroupService;
