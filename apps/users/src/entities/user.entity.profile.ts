/* istanbul ignore file */
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { RegisterRequest, RegisterResponse } from '@app/common/dto/register-dto';
import bcrypt from 'bcryptjs';
import { LoginResponse } from '@app/common/dto/login-dto';
import { Role } from '@app/common/roles';

@Injectable()
export class UserEntityProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        RegisterRequest,
        UserEntity,
        forMember((dest) => dest.id, ignore()),
        forMember((dest) => dest.createdAt, ignore()),
        forMember(
          (dest) => dest.passwordHash,
          mapFrom((src) => bcrypt.hashSync(src.password, bcrypt.genSaltSync(12))),
        ),
      );
      createMap(
        mapper,
        UserEntity,
        RegisterResponse,
        forMember(
          (dest) => dest.role,
          mapFrom((src) => Role[src.role as keyof typeof Role]),
        ),
      );
      createMap(
        mapper,
        UserEntity,
        LoginResponse,
        forMember(
          (dest) => dest.role,
          mapFrom((src) => Role[src.role as keyof typeof Role]),
        ),
      );
    };
  }
}
