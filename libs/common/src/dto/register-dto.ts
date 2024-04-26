import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { Role } from '../roles';

const passwordRegex: RegExp = /^(?!.*[\s])(?=.*[A-Z])(?=.*[.!@#$*])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/m;

export class RegisterRequest {
  @IsString()
  @AutoMap()
  address: string;

  @IsNotEmpty()
  @AutoMap()
  firstName: string;

  @IsNotEmpty()
  @AutoMap()
  lastName: string;

  @IsNotEmpty()
  @AutoMap()
  email: string;

  @Matches(passwordRegex)
  @AutoMap()
  password: string;

  @AutoMap()
  @IsEnum(Role)
  role: Role;
}

export class RegisterResponse {
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
