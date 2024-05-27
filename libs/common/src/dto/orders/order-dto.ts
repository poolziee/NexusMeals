import { IsNotEmpty } from 'class-validator';
import { AutoMap } from '@automapper/classes';

export enum OrderStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export class ReadOrderProductNoRelationsDTO {
  @AutoMap()
  id: string;

  @AutoMap()
  @IsNotEmpty()
  real_id: string;

  @AutoMap()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @IsNotEmpty()
  description: string;

  @AutoMap()
  @IsNotEmpty()
  quantity: number;

  @AutoMap()
  price: number;
}

export class CreateOrderProductDTO {
  id: number;
  quantity: number;
}

export class CreateOrderDTO {
  @AutoMap()
  @IsNotEmpty()
  address: string;

  @AutoMap()
  @IsNotEmpty()
  username: string;

  @AutoMap()
  @IsNotEmpty()
  email: string;

  @AutoMap()
  @IsNotEmpty()
  chefId: string;

  @AutoMap()
  @IsNotEmpty()
  chefName: string;

  @AutoMap()
  products: CreateOrderProductDTO[];
}

export class ReadOrderDTO {
  @AutoMap()
  id: string;

  @AutoMap()
  address: string;

  @AutoMap()
  username: string;

  @AutoMap()
  email: string;

  @AutoMap()
  products: ReadOrderProductNoRelationsDTO[];

  @AutoMap()
  chefId: string;

  @AutoMap()
  chefName: string;

  @AutoMap(() => String)
  status: OrderStatus;
}
