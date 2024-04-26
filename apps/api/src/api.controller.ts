import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ExampleRequest } from '@app/common/dto/example-request';
import { ApiService } from './api.service';
import { RegisterRequest } from '@app/common/dto/register-dto';
import { LoginRequest } from '@app/common/dto/login-dto';
import { CurrentUser } from '../../../libs/common/src/decorators/current-user.decorator';
import { UserSession } from '@app/common/dto/user-session-dto';
import { AuthGuard } from './middleware/auth.guard';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  async rpcExample() {
    return await this.apiService.rpcExample();
  }

  @Post()
  @UseGuards(AuthGuard)
  async pubSubExample(@CurrentUser() user: UserSession, @Body() request: ExampleRequest) {
    return this.apiService.pubSubExample(request, user);
  }

  @Post('users/register')
  async register(@Body() request: RegisterRequest) {
    return this.apiService.register(request);
  }

  @Post('users/login')
  async login(@Body() request: LoginRequest) {
    return this.apiService.login(request);
  }
}
