import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { RmqService } from '@app/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { RegisterRequest } from '@app/common/dto/register-dto';
import { NexPayload } from '@app/common/dto/nex-payload';
import { RegisterResponse } from '@app/common/dto/register-dto';
import { LoginRequest } from '@app/common/dto/login-dto';
import { PN } from '@app/common/constants';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(PN.register, Transport.TCP)
  async handleRegister(@Payload() pl: NexPayload<RegisterRequest>): Promise<RegisterResponse> {
    return await this.usersService.register(pl.data);
  }

  @MessagePattern(PN.login, Transport.TCP)
  async handleLogin(@Payload() pl: NexPayload<LoginRequest>): Promise<RegisterResponse> {
    return await this.usersService.login(pl.data);
  }
}
