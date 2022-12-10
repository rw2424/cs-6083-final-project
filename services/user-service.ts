import crypto from 'bcryptjs';
import jwt from 'jsonwebtoken';

import db from '../db';
import UserNotFound from '../errors/user-not-found';
import IncorrectPassword from '../errors/incorrect-password';
import InternalServerError from '../errors/internal-server-error';
import DuplicateUser from '../errors/duplicate-user';
import MainError from '../errors/main';

async function register(
  userName: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string,
  profile: string
) {
  try {
    db.initDBConnection();
    const hashedPassword = await crypto.hash(password, 8);
    const res = await db
      .getDBObject()
      .query(
        'INSERT into ?? (userName, password, fName, lName, email, profile) values (?,?,?,?,?,?)',
        [
          db.PersonTable,
          userName,
          hashedPassword,
          firstName,
          lastName,
          email,
          profile,
        ]
      );
    return {
      ...res,
      token: getToken(userName),
    };
  } catch (e) {
    console.error('Unable to register user');
    console.log(e);
    if (e.code && e.code === 'ER_DUP_ENTRY') {
      throw new DuplicateUser();
    }
    throw new InternalServerError();
  }
}

async function login(userName: string, password: string) {
  try {
    db.initDBConnection();
    const userRows = await db
      .getDBObject()
      .query(
        'SELECT userName, email, profile, fName, lName, password FROM ?? where userName = ?',
        [db.PersonTable, userName]
      );
    if (userRows.length != 1) {
      throw new UserNotFound();
    }
    const user = userRows[0];
    const passwordMatches = await crypto.compare(password, user.password);
    if (!passwordMatches) {
      throw new IncorrectPassword();
    }
    return {
      ...userRows[0],
      token: getToken(user.userName),
      password: undefined,
    };
  } catch (e) {
    console.error('unable to login');
    if (!(e instanceof MainError.ExtendableError)) {
      console.error(e);
      throw new InternalServerError();
    }
    throw e;
  }
}

function getUserByToken() {}

const JWTConfig = {
  issuer: 'cookzilla',
  audience: 'cookzilla',
  expiresIn: '2d',
};

function getToken(userName: string) {
  jwt.sign({ sub: userName }, process.env.jwtSecret as string, JWTConfig);
}

const UserService = {
  login,
  register,
  getUserByToken,
};

export default UserService;
