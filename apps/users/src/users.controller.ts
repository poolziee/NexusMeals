import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { RmqService } from '@app/common';
import { EventPattern, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { PN } from '@app/common/constants';
import {
  DeleteCategoryRequest,
  LoginRequest,
  NexPayload,
  ReadChefDTO,
  ReadChefsRequest,
  RegisterRequest,
  RegisterResponse,
  UpdateChefCategoryOverviewDTO,
  UserSession,
} from '@app/common/dto';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(PN.register, Transport.TCP)
  async handleRegister(@Payload() pl: NexPayload<RegisterRequest>): Promise<RegisterResponse> {
    return await this.usersService.register(pl.data);
  }

  @MessagePattern(PN.login, Transport.TCP)
  async handleLogin(@Payload() pl: NexPayload<LoginRequest>): Promise<RegisterResponse> {
    return await this.usersService.login(pl.data);
  }

  @MessagePattern(PN.user_by_id, Transport.TCP)
  async handleGetUserById(@Payload() pl: NexPayload<{ id: number }>): Promise<UserSession | null> {
    return await this.usersService.getUserById(pl.data.id);
  }

  @MessagePattern(PN.get_chefs, Transport.TCP)
  async handleGetChefs(@Payload() pl: NexPayload<ReadChefsRequest>): Promise<ReadChefDTO[]> {
    return await this.usersService.getChefs(pl.data);
  }

  @EventPattern(PN.update_chef_category_overview, Transport.RMQ)
  async handleUpdateChefCategoryOverview(@Payload() pl: NexPayload<UpdateChefCategoryOverviewDTO>): Promise<void> {
    await this.usersService.updateChefCategoryOverview(pl.data);
  }

  @EventPattern(PN.delete_chef_category_overview, Transport.RMQ)
  async handleDeleteChefCategoryOverview(@Payload() pl: NexPayload<DeleteCategoryRequest>): Promise<void> {
    await this.usersService.deleteChefCategoryOverview(pl.data);
  }

  @EventPattern(PN.add_product_to_chef_category_overview, Transport.RMQ)
  async handleAddProductToChefCategoryOverview(@Payload() pl: NexPayload<{ categoryId: number }>): Promise<void> {
    await this.usersService.productAddedToCategory(pl.data.categoryId);
  }

  @EventPattern(PN.remove_product_from_chef_category_overview, Transport.RMQ)
  async handleRemoveProductFromChefCategoryOverview(@Payload() pl: NexPayload<{ categoryId: number }>): Promise<void> {
    await this.usersService.productRemovedFromCategory(pl.data.categoryId);
  }
}
