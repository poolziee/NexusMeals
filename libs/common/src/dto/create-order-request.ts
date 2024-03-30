import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateOrderRequest {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsPositive()
  price: number;
}
