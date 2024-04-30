import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '@app/common';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersRepository extends AbstractRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
  ) {
    super(UserRepository);
  }
}
