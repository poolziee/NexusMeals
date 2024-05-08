import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getAllowedRoles } from '../decorators/roles.decorator';
import { SessionService } from '../session.service';
import jwt from '../utils/jwt';
import { AuthorizationError } from '@app/common/errors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private sessionService: SessionService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    // Get the token
    let access_token;
    if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      throw new AuthorizationError('You are not logged in!');
    }

    // Validate Access Token
    const decoded = jwt.verifyToken(access_token);

    if (!decoded) {
      throw new AuthorizationError(`Invalid access token!`);
    }

    const user = await this.sessionService.getUserSession(decoded.sessionId);
    if (!user) {
      throw new AuthorizationError(`User session has expired or user no longer exists.`);
    }
    req.user = user;
    const allowedRoles = getAllowedRoles(this.reflector, context);
    return !allowedRoles ? true : allowedRoles.some((role) => role === user.role);
  }
}
