import { Controller } from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';

import { RmqService } from '@app/common';

import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern('get_hello', Transport.TCP)
  getHello(): string {
    return this.productsService.getHello();
  }
}
