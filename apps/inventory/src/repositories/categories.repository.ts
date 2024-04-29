import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '@app/common';
import { CategoryEntity } from '../entities';

@Injectable()
export class CategoriesRepository extends AbstractRepository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly CategoriesRepository: Repository<CategoryEntity>,
  ) {
    super(CategoriesRepository);
  }
}
