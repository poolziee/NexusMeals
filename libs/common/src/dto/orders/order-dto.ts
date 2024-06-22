import { IsNotEmpty } from 'class-validator';
import { AutoMap } from '@automapper/classes';

export enum OrderStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
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
  products: CreateOrderProductDTO[];
}

export class ReadOrderProductDTO {
  @AutoMap()
  @IsNotEmpty()
  real_id: string;

  @AutoMap()
  @IsNotEmpty()
  chefId: number;

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

export class OrderCustomerDTO {
  @AutoMap()
  username: string;

  @AutoMap()
  email: string;
}

export class OrderChefDTO {
  @AutoMap()
  chefId: number;

  @AutoMap()
  chefName: string;
}

export class ReadOrderDTO {
  @AutoMap()
  _id: string;

  @AutoMap()
  address: string;

  @AutoMap()
  customer: OrderCustomerDTO;

  @AutoMap()
  chef: OrderChefDTO;

  @AutoMap()
  products: ReadOrderProductDTO[];

  @AutoMap(() => String)
  status: OrderStatus;
}
