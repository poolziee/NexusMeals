import { ExecutionContext, Injectable, NestInterceptor, CallHandler } from '@nestjs/common';
import { catchError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RpcErrorInterceptor implements NestInterceptor<any, any> {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      catchError((err) => {
        // TODO: type-check the err.
        throw new RpcException(err.message);
      }),
    );
  }
}
