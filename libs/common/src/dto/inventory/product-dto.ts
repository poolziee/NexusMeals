import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CategoryNoRelationsDTO {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;
}

export class DeleteProductRequest {
  @IsNotEmpty()
  id: number;
}

export class ReadProductDTO {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  chefId: string;

  @AutoMap()
  description: string;

  @AutoMap()
  quantity: number;

  @AutoMap()
  category: CategoryNoRelationsDTO;

  @AutoMap()
  price: number;
}

export class CreateProductDTO {
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @IsNotEmpty()
  description: string;

  @AutoMap()
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  category: string;

  @AutoMap()
  @IsNotEmpty()
  @IsPositive()
  price: number;
}

export class UpdateProductDTO {
  @AutoMap()
  @IsNotEmpty()
  id: number;

  @AutoMap()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @IsNotEmpty()
  description: string;

  @AutoMap()
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  category: string;

  @AutoMap()
  @IsNotEmpty()
  @IsPositive()
  price: number;
}
