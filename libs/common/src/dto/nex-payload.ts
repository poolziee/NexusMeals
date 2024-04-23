import { IsNotEmpty, ValidateNested } from 'class-validator';

export class NexPayload<T> {
  @IsNotEmpty()
  @ValidateNested()
  data: T;
}
