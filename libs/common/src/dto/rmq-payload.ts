import { IsNotEmpty, ValidateNested } from 'class-validator';

export class RmqPayload<T> {
  @IsNotEmpty()
  @ValidateNested()
  data: T;
}
