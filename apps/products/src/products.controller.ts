import { Controller, UseInterceptors } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

import { RmqService } from '@app/common';

import { ProductsService } from './products.service';
import { RpcErrorInterceptor } from '@app/common/middleware/RpcErrorInterceptor';

@Controller()
@UseInterceptors(RpcErrorInterceptor)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern('get_hello')
  getHello(@Ctx() context: RmqContext): string {
    this.rmqService.ack(context);
    return this.productsService.getHello();
  }
}
