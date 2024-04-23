import { Controller, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { RmqService } from '@app/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { RpcErrorInterceptor } from '@app/common/middleware/RpcErrorInterceptor';
import { RegisterRequest } from '@app/common/dto/register-dto';
import { RmqPayload } from '@app/common/dto/rmq-payload';
import { RegisterResponse } from '@app/common/dto/register-dto';
import { LoginRequest } from '@app/common/dto/login-dto';

@Controller()
@UseInterceptors(RpcErrorInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern('register')
  async handleRegister(
    @Payload() pl: RmqPayload<RegisterRequest>,
    @Ctx() context: RmqContext,
  ): Promise<RegisterResponse> {
    this.rmqService.ack(context);
    return await this.usersService.register(pl.data);
  }

  @MessagePattern('login')
  async handleLogin(@Payload() pl: RmqPayload<LoginRequest>, @Ctx() context: RmqContext): Promise<RegisterResponse> {
    this.rmqService.ack(context);
    return await this.usersService.login(pl.data);
  }
}
