import { Injectable } from '@nestjs/common';
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ReadChefDTO,
  ReadChefsRequest,
  UpdateChefCategoryOverviewDTO,
  DeleteCategoryRequest,
} from '@app/common/dto';
import { UserEntity } from './entities/user.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import bcrypt from 'bcryptjs';
import { AuthenticationError, ConflictError } from '@app/common/errors';
import { Role } from '@app/common/roles';
import { UsersRepository, ChefCategoryOverviewRepository } from './repositories';
import { ChefCategoryOverviewEntity } from './entities';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly chefOverviewRepo: ChefCategoryOverviewRepository,
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

  async getChefs(req: ReadChefsRequest): Promise<ReadChefDTO[]> {
    const user = await this.userRepo.findAllBy({ role: Role.CHEF, city: req.city });
    return this.mapper.mapArray(user, UserEntity, ReadChefDTO);
  }

  async updateChefCategoryOverview(req: UpdateChefCategoryOverviewDTO): Promise<void> {
    const chef = await this.userRepo.findOneBy({ id: req.chefId });
    const overview = this.mapper.map(req, UpdateChefCategoryOverviewDTO, ChefCategoryOverviewEntity);
    overview.chef = chef;
    await this.chefOverviewRepo.save(overview);
  }

  async deleteChefCategoryOverview(req: DeleteCategoryRequest): Promise<void> {
    await this.chefOverviewRepo.delete({ id: req.id });
  }

  async productAddedToCategory(categoryId: number): Promise<void> {
    const overview = await this.chefOverviewRepo.findOneBy({ id: categoryId });
    overview.totalProducts += 1;
    await this.chefOverviewRepo.save(overview);
  }

  async productRemovedFromCategory(categoryId: number): Promise<void> {
    const overview = await this.chefOverviewRepo.findOneBy({ id: categoryId });
    overview.totalProducts -= 1;
    await this.chefOverviewRepo.save(overview);
  }
}
