import { CustomError } from './CustomError';

export class AuthenticationError extends CustomError {
  constructor(message: string) {
    super(message, 401, 'AuthenticationError');
  }
}
