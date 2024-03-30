import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { CreateOrderRequest } from '@app/common/dto/create-order-request';

import { ApiService } from './api.service';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  async getHello() {
    return await this.apiService.getHello();
  }

  @Post()
  async createOrder(@Body() request: CreateOrderRequest, @Req() req: any) {
    return this.apiService.createOrder(request, req.cookies?.Authentication);
  }
}
