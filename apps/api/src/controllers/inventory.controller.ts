import { Body, Controller, Inject, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../middleware/auth.guard';
import { PN, TCP_INVENTORY } from '@app/common/constants';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateCategoryDTO,
  CreateProductDTO,
  DeleteCategoryRequest,
  DeleteProductRequest,
  NexPayload,
  ReadCategoryRequest,
  UpdateCategoryDTO,
  UpdateProductDTO,
  UserSession,
} from '@app/common/dto';
import { CurrentUser } from '@app/common/decorators';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@app/common/roles';
import { firstValueFrom } from 'rxjs';

@Controller('inventory')
@UseGuards(AuthGuard)
export class InventoryController {
  constructor(@Inject(TCP_INVENTORY) private tcpInventory: ClientProxy) {}

  @Post('categories')
  async readCategories(@CurrentUser() user: UserSession, @Body() data: ReadCategoryRequest) {
    return await firstValueFrom(this.tcpInventory.send(PN.read_categories, new NexPayload(data, user)));
  }

  @Post('category/create')
  @Roles(Role.CHEF)
  async createCategory(@CurrentUser() user: UserSession, @Body() data: CreateCategoryDTO) {
    return await firstValueFrom(this.tcpInventory.send(PN.create_category, new NexPayload(data, user)));
  }

  @Put('category/update')
  @Roles(Role.CHEF)
  async updateCategory(@CurrentUser() user: UserSession, @Body() data: UpdateCategoryDTO) {
    return await firstValueFrom(this.tcpInventory.send(PN.update_category, new NexPayload(data, user)));
  }

  @Post('category/delete')
  @Roles(Role.CHEF)
  async deleteCategory(@CurrentUser() user: UserSession, @Body() data: DeleteCategoryRequest) {
    return await firstValueFrom(this.tcpInventory.send(PN.delete_category, new NexPayload(data, user)));
  }

  /* ------------------------------------------------------------------------------------------------------------------ */

  @Post('product/create')
  @Roles(Role.CHEF)
  async createProduct(@CurrentUser() user: UserSession, @Body() data: CreateProductDTO) {
    return await firstValueFrom(this.tcpInventory.send(PN.create_product, new NexPayload(data, user)));
  }

  @Put('product/update')
  @Roles(Role.CHEF)
  async updateProduct(@CurrentUser() user: UserSession, @Body() data: UpdateProductDTO) {
    return await firstValueFrom(this.tcpInventory.send(PN.update_product, new NexPayload(data, user)));
  }

  @Post('product/delete')
  @Roles(Role.CHEF)
  async deleteProduct(@CurrentUser() user: UserSession, @Body() data: DeleteProductRequest) {
    return await firstValueFrom(this.tcpInventory.send(PN.delete_product, new NexPayload(data, user)));
  }

  /* ------------------------------------------------------------------------------------------------------------------ */

  @Post('categories/generate')
  @Roles(Role.CHEF)
  async generateCategories(@CurrentUser() user: UserSession, @Body() data: CreateCategoryDTO[]) {
    for (const category of data) {
      await firstValueFrom(this.tcpInventory.send(PN.create_category, new NexPayload(category, user)));
    }
    return 'Categories generated';
  }

  @Post('products/generate')
  @Roles(Role.CHEF)
  async generateProducts(@CurrentUser() user: UserSession, @Body() data: CreateProductDTO[]) {
    for (const product of data) {
      await firstValueFrom(this.tcpInventory.send(PN.create_product, new NexPayload(product, user)));
    }
    return 'Products generated';
  }
}
