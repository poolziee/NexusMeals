import { IsEnum, IsNotEmpty, Matches } from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { Role } from '../../roles';

const passwordRegex: RegExp = /^(?!.*[\s])(?=.*[A-Z])(?=.*[.!@#$*])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/m;

const postalCodeRegex: RegExp = /^[0-9]{4}[A-Z]{2}$/m;

export class RegisterRequest {
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

  @AutoMap()
  @IsNotEmpty()
  city: string;

  @AutoMap()
  @IsNotEmpty()
  @Matches(postalCodeRegex)
  postalCode: string;

  @AutoMap()
  @IsNotEmpty()
  street: string;

  @AutoMap()
  @IsNotEmpty()
  houseNumber: string;
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

  @AutoMap()
  city: string;

  @AutoMap()
  postalCode: string;

  @AutoMap()
  street: string;

  @AutoMap()
  houseNumber: string;
}
