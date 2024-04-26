import { ErrorObject } from '@app/common/errors/ErrorObject';
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class RpcExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    if (exception.status === 'CustomRpcException') {
      const err: ErrorObject = exception;
      response.status(err.errorCode).json({
        statusCode: err.errorCode,
        message: err.message,
        errorType: err.errorType,
      });
    } else {
      super.catch(exception, host);
    }
  }
}
