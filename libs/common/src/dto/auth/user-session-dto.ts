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

  @IsNotEmpty()
  @AutoMap()
  username: string;

  @IsNotEmpty()
  @AutoMap()
  createdAt: string;

  @IsNotEmpty()
  @AutoMap()
  city: string;

  @IsNotEmpty()
  @AutoMap()
  postalCode: string;

  @IsNotEmpty()
  @AutoMap()
  street: string;

  @IsNotEmpty()
  @AutoMap()
  houseNumber: string;

  @IsEnum(Role)
  @AutoMap(() => String)
  role: Role;
}
