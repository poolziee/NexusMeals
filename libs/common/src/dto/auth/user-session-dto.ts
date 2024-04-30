import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../roles';
import { AutoMap } from '@automapper/classes';

export class UserSession {
  @IsNotEmpty()
  @AutoMap()
  id: number;

  @IsNotEmpty()
  @AutoMap()
  firstName: string;

  @IsNotEmpty()
  @AutoMap()
  lastName: string;

  @IsNotEmpty()
  @AutoMap()
  email: string;

  @IsEnum(Role)
  @AutoMap()
  role: Role;
}
