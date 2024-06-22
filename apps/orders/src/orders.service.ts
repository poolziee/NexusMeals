import { Inject, Injectable } from '@nestjs/common';
import { OrdersRepository } from './repositories/orders.repository';
import { RMQ_INVENTORY } from '@app/common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { OrderProductsRepository } from './repositories/orderproducts.repository';
import { CreateOrderDTO, ReadOrderDTO, UserSession } from '@app/common/dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { OrderEntity } from './entities';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepo: OrdersRepository,
    private readonly orderProductRepo: OrderProductsRepository,
    @Inject(RMQ_INVENTORY) private readonly rmqInventory: ClientProxy,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  // todo
  // async createOrder(req: CreateOrderDTO, customer: UserSession): ReadOrderDTO {
  //   const order = this.mapper.map(req, CreateOrderDTO, OrderEntity);
  //   order.products = req.products;
  // }
}
