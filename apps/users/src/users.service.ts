import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { RegisterRequest } from '@app/common/dto/register-request';
import { UserEntity } from './entities/user.entity';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UsersRepository) {}
  async register(user: RegisterRequest) {
    // TODO: 1.validate user does not exist; 2. Implement DTO mapper.
    const newUser = new UserEntity();
    newUser.email = user.email;
    newUser.passwordHash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(12));
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    const createdUser = await this.userRepo.save(newUser);
    {
      // TODO: DTO mapper.
      return {
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
      };
    }
  }
}
