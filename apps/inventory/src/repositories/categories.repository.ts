import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '@app/common';
import { CategoryEntity, ProductEntity } from '../entities';

@Injectable()
export class CategoriesRepository extends AbstractRepository<CategoryEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly CategoriesRepository: Repository<CategoryEntity>,
  ) {
    super(CategoriesRepository);
  }
}
