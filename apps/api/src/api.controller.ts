import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ExampleRequest } from '@app/common/dto/example-request';
import { ApiService } from './api.service';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  async rpcExample() {
    return await this.apiService.rpcExample();
  }

  @Post()
  async pubSubExample(@Body() request: ExampleRequest, @Req() req: any) {
    return this.apiService.pubSubExample(request, req.cookies?.Authentication);
  }
}
