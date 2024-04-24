import { IsNotEmpty, IsObject, ValidateIf, ValidateNested } from 'class-validator';
import { UserSession } from './user-session-dto';

export class NexPayload<T> {
  constructor(data: T, user: UserSession = null) {
    this.data = data;
    this.user = user;
  }
  @IsNotEmpty()
  @ValidateNested()
  data: T;
  @IsObject()
  @ValidateIf((object, value) => value !== null)
  user: UserSession | null;
}
