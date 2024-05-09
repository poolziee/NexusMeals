import { Body, Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { PN, TCP_USERS } from '@app/common/constants';
import { LoginRequest, RegisterRequest, NexPayload, LoginResponse, UserSession } from '@app/common/dto';
import { SessionService } from '../session.service';
import jwt from '../utils/jwt';
import { AuthenticationError, AuthorizationError } from '@app/common/errors';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(TCP_USERS) private tcpUsers: ClientProxy,
    private readonly sessionService: SessionService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Post('register')
  async register(@Body() data: RegisterRequest) {
    return await firstValueFrom(this.tcpUsers.send(PN.register, new NexPayload(data)));
  }

  @Post('login')
  async login(@Req() req, @Body() data: LoginRequest, @Res() res) {
    let oldSessionId: string | undefined;
    if (req.cookies.refresh_token) {
      const decoded = jwt.verifyToken(req.cookies.refresh_token);
      if (decoded) {
        oldSessionId = decoded.sessionId;
      }
    }

    const user: LoginResponse = await firstValueFrom(this.tcpUsers.send(PN.login, new NexPayload(data)));
    const { access_token, refresh_token } = await this.sessionService.signAndSetSession(
      this.mapper.map(user, LoginResponse, UserSession),
      oldSessionId,
    );
    const { accessTokenCookieOptions, refreshTokenCookieOptions, currentUserCookieOptions } =
      await this.sessionService.getCookieOptions();
    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
    res.cookie('current_user', JSON.stringify(user), currentUserCookieOptions);
    return res.json(user);
  }

  @Get('refresh')
  async refresh(@Req() req, @Res() res) {
    if (!req.cookies.refresh_token) {
      throw new AuthenticationError('You are not logged in!');
    }
    // Get the refresh token from cookie.
    const old_refresh_token = req.cookies.refresh_token as string;

    // Validate the Refresh token.
    const decoded = jwt.verifyToken(old_refresh_token);
    console.log('Refreshing.');
    console.log(decoded);
    try {
      const message = 'Could not refresh access token!';
      if (!decoded) {
        throw new AuthorizationError(message);
      }

      // Check if the user has a valid session.
      let user = await this.sessionService.getUserSession(decoded.sessionId);
      console.log('User logging.');
      console.log(user);
      if (!user) {
        throw new AuthorizationError(message);
      }

      // TODO: Check if the user exists and update user variable.
      user = await firstValueFrom(this.tcpUsers.send(PN.user_by_id, new NexPayload({ id: user.id })));
      if (!user) {
        throw new AuthorizationError('User does not exist anymore!');
      }

      // Sign new access token and update session.
      const { access_token, refresh_token } = await this.sessionService.signAndSetSession(user, decoded.sessionId);

      // Send token as cookie.
      const { accessTokenCookieOptions, refreshTokenCookieOptions, currentUserCookieOptions } =
        await this.sessionService.getCookieOptions();
      res.cookie('access_token', access_token, accessTokenCookieOptions);
      res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
      res.cookie('current_user', JSON.stringify(user), currentUserCookieOptions);
      return res.json(user);
    } catch (e) {
      res.cookie('access_token', '', { maxAge: 1 });
      res.cookie('refresh_token', '', { maxAge: 1 });
      res.cookie('current_user', '', { maxAge: 1 });
      if (decoded) await this.sessionService.deleteUserSession(decoded.sessionId);
      throw e;
    }
  }

  @Get('logout')
  async logout(@Req() req, @Res() res) {
    try {
      // Get the token
      let refresh_token;
      if (req.cookies.refresh_token) {
        refresh_token = req.cookies.refresh_token;
      }

      if (!refresh_token) {
        throw new AuthenticationError('You are not logged in!');
      }

      // Validate Access Token
      const decoded = jwt.verifyToken(refresh_token);

      if (!decoded) {
        throw new AuthenticationError('Token invalid or expired.');
      }

      await this.sessionService.deleteUserSession(decoded.sessionId);

      res.cookie('access_token', '', { maxAge: 1 });
      res.cookie('refresh_token', '', { maxAge: 1 });
      res.cookie('current_user', '', { maxAge: 1 });

      return res.json('Logged out.');
    } catch (e) {
      res.cookie('access_token', '', { maxAge: 1 });
      res.cookie('refresh_token', '', { maxAge: 1 });
      res.cookie('current_user', '', { maxAge: 1 });
      throw e;
    }
  }
}
