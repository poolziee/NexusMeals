import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PN, TCP_USERS } from '@app/common/constants';
import { TcpClient } from '@app/common';
import { LoginRequest, RegisterRequest, NexPayload } from '@app/common/dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(TCP_USERS) private tcpUsers: TcpClient) {}

  @Post('register')
  async register(@Body() pl: RegisterRequest) {
    return await this.tcpUsers.send(PN.register, new NexPayload(pl));
  }

  @Post('login')
  async login(@Body() pl: LoginRequest) {
    return await this.tcpUsers.send(PN.login, new NexPayload(pl));
  }
}
