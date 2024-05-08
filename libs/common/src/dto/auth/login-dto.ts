import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';
import { Role } from '../../roles';

export class LoginRequest {
  @IsNotEmpty()
  @AutoMap()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class LoginResponse {
  @AutoMap()
  id: number;

  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  email: string;

  @AutoMap()
  username: string;

  @AutoMap()
  createdAt: string;

  @AutoMap(() => String)
  role: Role;

  @AutoMap()
  city: string;

  @AutoMap()
  postalCode: string;

  @AutoMap()
  street: string;

  @AutoMap()
  houseNumber: string;
}
