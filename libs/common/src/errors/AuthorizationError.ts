import { CustomError } from './CustomError';

export class AuthorizationError extends CustomError {
  constructor(message: string) {
    super(message, 403, 'AuthorizationError');
  }
}
