import { UserSession } from '@app/common/dto';
import { Injectable } from '@nestjs/common';
import jwt from './utils/jwt';
import { Role } from '@app/common/roles';

@Injectable()
export class SessionService {
  constructor() {}
  async getCookieOptions() {
    // Cookie options.
    const accessTokenCookieOptions = {
      expires: new Date(Date.now() + 60 * 15 * 60 * 1000),
      maxAge: 60 * 15 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    };

    const refreshTokenCookieOptions = {
      // After refresh token expires, user should be logged out.
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 60 * 1000),
      maxAge: 60 * 60 * 24 * 7 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    };

    return { accessTokenCookieOptions, refreshTokenCookieOptions };
  }

  private async setUserSession(user: UserSession) {
    // TODO: set in redis.
    return 'sessionId';
  }

  private async updateUserSession(oldSessionId: string, user: UserSession) {
    // TODO: update in redis.
    return 'updatedSessionId';
  }

  async deleteUserSession(sessionId: string) {
    // TODO: delete from redis.
  }

  getUserSession(sessionId: string): UserSession {
    // TODO: get from redis.
    return { id: 1, firstName: 'A', lastName: 'B', email: 'C', role: Role.CUSTOMER };
  }

  async signAndSetSession(user: UserSession, oldSessionId?: string) {
    // Update session if old session id was provided, set a new session otherwise.
    let sessionId: string;
    if (oldSessionId) sessionId = await this.updateUserSession(oldSessionId, user);
    else sessionId = await this.setUserSession(user);

    // Sign the access token.
    const access_token = jwt.signToken({ sessionId: sessionId }, { expiresIn: '1h' });

    // Sign the refresh token.
    const refresh_token = jwt.signToken({ sessionId: sessionId }, { expiresIn: '7d' });

    return { access_token, refresh_token };
  }
}
