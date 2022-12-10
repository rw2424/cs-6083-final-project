import MainError from './main';

export default class InvalidJwtError extends MainError.ExtendableError {
  constructor(info = 'Insufficient credentials') {
    super({ code: MainError.INVALID_JWT_TOKEN, info });
  }
}
