import MainError from './main';

export default class IncorrectPassword extends MainError.ExtendableError {
  constructor(info = 'Incorrect credentials') {
    super({ code: MainError.WRONG_CREDENTIALS, info });
  }
}
