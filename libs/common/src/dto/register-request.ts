import { IsString, Matches } from 'class-validator';

const passwordRegex: RegExp = /^(?!.*[\s])(?=.*[A-Z])(?=.*[.!@#$*])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/m;

// TODO: Maybe add to the same file as RegisterResponse?
export class RegisterRequest {
  @IsString()
  address: string;

  firstName: string;

  lastName: string;

  email: string;

  // TODO: Send clear message what is wrong with the password.
  @Matches(passwordRegex)
  password: string;
}
