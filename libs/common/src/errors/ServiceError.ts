import { CustomError } from './CustomError';

export class ServiceError extends CustomError {
  constructor(errorCode: number, errorType: string, message: string) {
    super(message, errorCode, errorType);
  }
}
