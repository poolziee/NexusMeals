import { UserSession } from '@app/common/dto/user-session-dto';
import { Role } from '@app/common/roles';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { getAllowedRoles } from '../decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // TODO: decrypt jwt and extract session from redis. Throw if no user.
    const user: UserSession = { id: 1, firstName: 'A', lastName: 'B', email: 'C', role: Role.CUSTOMER };
    context.switchToHttp().getRequest().user = user;
    const allowedRoles = getAllowedRoles(this.reflector, context);
    return !allowedRoles ? true : allowedRoles.some((role) => role === user.role);
  }
}
