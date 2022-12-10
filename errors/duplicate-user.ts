import MainError from './main';

export default class DuplicateUser extends MainError.ExtendableError {
  constructor(info = 'User already Registered') {
    super({ code: MainError.USER_CONFLICT, info });
  }
}
