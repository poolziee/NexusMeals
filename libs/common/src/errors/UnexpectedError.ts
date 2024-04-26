import { CustomError } from './CustomError';

export class UnexpectedError extends CustomError {
  constructor(message: string, statusCode = 500) {
    super(`BUG: ${message}`, statusCode, 'UnexpectedError');
  }
}
