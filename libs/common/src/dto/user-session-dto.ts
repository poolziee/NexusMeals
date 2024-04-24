import { IsNotEmpty } from 'class-validator';

export class UserSession {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  email: string;
}
