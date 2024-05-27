import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '@app/common';
import { OrderProductEntity } from '../entities/orderproduct.entity';

@Injectable()
export class OrderProductsRepository extends AbstractRepository<OrderProductEntity> {
  constructor(
    @InjectRepository(OrderProductEntity)
    private readonly OrderProductsRepository: Repository<OrderProductEntity>,
  ) {
    super(OrderProductsRepository);
  }
}
