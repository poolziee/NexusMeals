import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../roles';

export class UserSession {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  email: string;
  @IsEnum(Role)
  role: Role;
}
