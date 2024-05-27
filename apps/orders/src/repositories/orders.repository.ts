import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '@app/common';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class OrdersRepository extends AbstractRepository<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly OrdersRepository: Repository<OrderEntity>,
  ) {
    super(OrdersRepository);
  }
}
