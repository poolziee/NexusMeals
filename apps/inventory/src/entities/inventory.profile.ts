/* istanbul ignore file */
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from './category.entity';
import {
  CreateCategoryDTO,
  CreateProductDTO,
  ReadCategoryDTO,
  ReadCategoryNoProductsDTO,
  ReadProductDTO,
  UpdateCategoryDTO,
  UpdateProductDTO,
} from '@app/common/dto';

@Injectable()
export class InventoryProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, ProductEntity, ReadProductDTO);
      createMap(mapper, CategoryEntity, ReadCategoryDTO);
      createMap(mapper, CategoryEntity, ReadCategoryNoProductsDTO);
      createMap(
        mapper,
        CreateCategoryDTO,
        CategoryEntity,
        forMember((dest) => dest.id, ignore()),
        forMember((dest) => dest.products, ignore()),
        forMember((dest) => dest.chefId, ignore()),
      );
      createMap(
        mapper,
        UpdateCategoryDTO,
        CategoryEntity,
        forMember((dest) => dest.products, ignore()),
        forMember((dest) => dest.chefId, ignore()),
      );
      createMap(
        mapper,
        CreateProductDTO,
        ProductEntity,
        forMember((dest) => dest.id, ignore()),
        forMember((dest) => dest.category, ignore()),
        forMember((dest) => dest.chefId, ignore()),
      );
      createMap(
        mapper,
        UpdateProductDTO,
        ProductEntity,
        forMember((dest) => dest.category, ignore()),
        forMember((dest) => dest.chefId, ignore()),
      );
    };
  }
}
