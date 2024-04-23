import { ExecutionContext, Injectable, NestInterceptor, CallHandler } from '@nestjs/common';
import { catchError } from 'rxjs';
import { CustomError } from '../errors';

@Injectable()
export class RpcErrorInterceptor implements NestInterceptor<any, any> {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof CustomError) {
          console.log(err);
        }
        throw err;
      }),
    );
  }
}
