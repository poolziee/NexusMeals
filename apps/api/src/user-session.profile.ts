/* istanbul ignore file */
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { LoginResponse, UserSession } from '@app/common/dto';

@Injectable()
export class UserSessionProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, LoginResponse, UserSession);
    };
  }
}
