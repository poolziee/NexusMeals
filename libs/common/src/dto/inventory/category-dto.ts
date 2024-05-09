import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';

export class ProductNoRelationsDTO {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  quantity: number;

  @AutoMap()
  price: number;
}

export class ReadCategoryRequest {
  @IsNotEmpty()
  chefId: number;
  @IsNotEmpty()
  withProducts: boolean;
}

export class DeleteCategoryRequest {
  @IsNotEmpty()
  id: number;
}

export class ReadCategoryDTO {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  chefId: number;

  @AutoMap()
  description: string;

  @AutoMap()
  products: ProductNoRelationsDTO[];
}

export class ReadCategoryNoProductsDTO {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  chefId: string;

  @AutoMap()
  description: string;
}

export class CreateCategoryDTO {
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @IsNotEmpty()
  description: string;
}

export class UpdateCategoryDTO {
  @AutoMap()
  @IsNotEmpty()
  id: number;

  @AutoMap()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @IsNotEmpty()
  description: string;
}
