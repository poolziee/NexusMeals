import { UserSession } from '@app/common/dto/user-session-dto';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // TODO: decrypt jwt and extract session from redis.
    const user: UserSession = { id: 1, firstName: 'A', lastName: 'B', email: 'C' };
    context.switchToHttp().getRequest().user = user;
    return true;
  }
}
