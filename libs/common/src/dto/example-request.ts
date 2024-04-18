import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class ExampleRequest {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsPositive()
  price: number;
}
