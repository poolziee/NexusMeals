import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { RmqService } from '@app/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { PN } from '@app/common/constants';
import { LoginRequest, NexPayload, RegisterRequest, RegisterResponse } from '@app/common/dto';

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
    console.log('Received login:', pl.data);
    return await this.usersService.login(pl.data);
  }
}
