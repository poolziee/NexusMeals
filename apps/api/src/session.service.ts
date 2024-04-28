import { UserSession } from '@app/common/dto';
import { Inject, Injectable } from '@nestjs/common';
import jwt from './utils/jwt';
import { REDIS_SESSIONS } from '@app/common/constants';
import { v4 as uuidv4 } from 'uuid';
import { RedisClient } from '@app/common/redis/redis.module';

@Injectable()
export class SessionService {
  constructor(@Inject(REDIS_SESSIONS) private readonly redisSessions: RedisClient) {}
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

  private toKey = (sessionId: string) => 'sess:' + sessionId;

  private async setUserSession(user: UserSession) {
    const key = this.toKey(uuidv4());
    await this.redisSessions.set(key, JSON.stringify(user), 'EX', 60 * 60 * 24 * 7);
    return key.slice(5);
  }

  private async updateUserSession(oldSessionId: string, user: UserSession) {
    await this.deleteUserSession(oldSessionId);
    return await this.setUserSession(user);
  }

  async deleteUserSession(sessionId: string) {
    return await this.redisSessions.del(this.toKey(sessionId));
  }

  async getUserSession(sessionId: string): Promise<UserSession | null> {
    const user = await this.redisSessions.get(this.toKey(sessionId));

    if (user) return JSON.parse(user);
    else return null;
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
