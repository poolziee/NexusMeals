import { Inject, Injectable } from '@nestjs/common';
import { PN, RMQ_USERS, TCP_INVENTORY } from '@app/common/constants';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateOrderDTO,
  CreateOrderProductDTO,
  NexPayload,
  ReadOrderDTO,
  ReadOrderProductNoRelationsDTO,
  UserSession,
} from '@app/common/dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Order, Product } from './schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @Inject(TCP_INVENTORY) private readonly tcpInventory: ClientProxy,
    @Inject(RMQ_USERS) private readonly rmqUsers: ClientProxy,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async createOrder(req: CreateOrderDTO, customer: UserSession): Promise<ReadOrderDTO> {
    const products: ReadOrderProductNoRelationsDTO[] = await lastValueFrom(
      this.tcpInventory.send(PN.create_order, new NexPayload(req.products)),
    );
    const order = new this.orderModel(req);
    order.chefId = products[0].chefId;
    order.username = customer.username;
    order.email = customer.email;
    order.products = this.mapper.mapArray(products, ReadOrderProductNoRelationsDTO, Product);
  }
}
