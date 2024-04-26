import { Body, Controller, Inject, Post } from '@nestjs/common';
import { TCP_USERS } from '@app/common/constants';
import { TcpClient } from '@app/common';
import { LoginRequest, RegisterRequest, NexPayload } from '@app/common/dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(TCP_USERS) private tcpUsers: TcpClient) {}

  @Post('register')
  async register(@Body() request: RegisterRequest) {
    return await this.tcpUsers.send('register', new NexPayload(request));
  }

  @Post('login')
  async login(@Body() request: LoginRequest) {
    return await this.tcpUsers.send('login', new NexPayload(request));
  }
}
