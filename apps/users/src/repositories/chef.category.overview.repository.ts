import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '@app/common';
import { ChefCategoryOverviewEntity } from '../entities/chef.category.overview.entity';

@Injectable()
export class ChefCategoryOverviewRepository extends AbstractRepository<ChefCategoryOverviewEntity> {
  constructor(
    @InjectRepository(ChefCategoryOverviewEntity)
    private readonly ChefCategoryOverviewRepository: Repository<ChefCategoryOverviewEntity>,
  ) {
    super(ChefCategoryOverviewRepository);
  }
}
