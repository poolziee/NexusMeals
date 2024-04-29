/* istanbul ignore file */
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, Mapper, mapWith } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from './category.entity';
import {
  CreateCategoryDTO,
  CreateProductDTO,
  ReadCategoryDTO,
  ReadCategoryNoProductsDTO,
  ReadProductDTO,
  ProductNoRelationsDTO,
  UpdateCategoryDTO,
  UpdateProductDTO,
  CategoryNoRelationsDTO,
} from '@app/common/dto';

@Injectable()
export class InventoryProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, ProductEntity, ProductNoRelationsDTO);
      createMap(mapper, CategoryEntity, CategoryNoRelationsDTO);
      createMap(
        mapper,
        CategoryEntity,
        ReadCategoryDTO,
        forMember(
          (dest) => dest.products,
          mapWith(ProductNoRelationsDTO, ProductEntity, (src) => src.products),
        ),
      );
      createMap(mapper, CategoryEntity, ReadCategoryNoProductsDTO);
      createMap(
        mapper,
        ProductEntity,
        ReadProductDTO,
        forMember(
          (dest) => dest.category,
          mapWith(CategoryNoRelationsDTO, CategoryEntity, (src) => src.category),
        ),
      );
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
