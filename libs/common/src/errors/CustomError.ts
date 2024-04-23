import { RpcException } from '@nestjs/microservices';
import { ErrorObject } from './ErrorObject';

export class CustomError extends RpcException {
  constructor(message: string, errorCode: number, errorType: string) {
    const errorObj: ErrorObject = { status: 'RpcException', message, errorCode, errorType };
    super(errorObj);
  }
}
