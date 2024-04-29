import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '@app/common';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductsRepository extends AbstractRepository<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly ProductsRepository: Repository<ProductEntity>,
  ) {
    super(ProductsRepository);
  }
}
