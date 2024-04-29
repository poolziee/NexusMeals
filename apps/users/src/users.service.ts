import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '@app/common/dto';
import { UserEntity } from './entities/user.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import bcrypt from 'bcryptjs';
import { AuthenticationError, ConflictError } from '@app/common/errors';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UsersRepository,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async login(req: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepo.findOneBy({ email: req.email });
    if (!user || !bcrypt.compareSync(req.password, user.passwordHash)) {
      throw new AuthenticationError('Invalid email or password.');
    }
    return this.mapper.map(user, UserEntity, LoginResponse);
  }

  async register(req: RegisterRequest): Promise<RegisterResponse> {
    const exists = await this.userRepo.findOneBy({ email: req.email });
    if (exists) {
      throw new ConflictError(`User with email '${req.email} 'already exists.`);
    }
    let newUser = this.mapper.map(req, RegisterRequest, UserEntity);
    newUser = await this.userRepo.save(newUser);
    return this.mapper.map(newUser, UserEntity, RegisterResponse);
  }
}
