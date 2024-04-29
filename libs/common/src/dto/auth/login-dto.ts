import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';
import { Role } from '../../roles';

export class LoginRequest {
  @IsNotEmpty()
  email: string;
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
  createdAt: string;

  @AutoMap()
  role: Role;
}
