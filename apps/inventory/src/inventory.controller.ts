import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';

import { RmqService } from '@app/common';

import { InventoryService } from './inventory.service';
import {
  CreateCategoryDTO,
  CreateProductDTO,
  DeleteCategoryRequest,
  DeleteProductRequest,
  NexPayload,
  ReadCategoryDTO,
  ReadCategoryNoProductsDTO,
  ReadCategoryRequest,
  ReadProductDTO,
  UpdateCategoryDTO,
  UpdateProductDTO,
  UserSession,
} from '@app/common/dto';
import { CurrentUser } from '@app/common/decorators';
import { PN } from '@app/common/constants';

@Controller()
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(PN.read_categories, Transport.TCP)
  async handleReadCategories(
    @Payload() pl: NexPayload<ReadCategoryRequest>,
  ): Promise<ReadCategoryDTO[] | ReadCategoryNoProductsDTO[]> {
    return await this.inventoryService.readCategoriesByChefId(pl.data);
  }

  @MessagePattern(PN.create_category, Transport.TCP)
  async handleCreateCategory(
    @CurrentUser() chef: UserSession,
    @Payload() pl: NexPayload<CreateCategoryDTO>,
  ): Promise<ReadCategoryDTO> {
    return await this.inventoryService.createCategory(pl.data, chef);
  }

  @MessagePattern(PN.update_category, Transport.TCP)
  async handleUpdateCategory(
    @CurrentUser() chef: UserSession,
    @Payload() pl: NexPayload<UpdateCategoryDTO>,
  ): Promise<ReadCategoryDTO> {
    return await this.inventoryService.updateCategory(pl.data, chef);
  }

  @MessagePattern(PN.delete_category, Transport.TCP)
  async handleDeleteCategory(
    @CurrentUser() chef: UserSession,
    @Payload() pl: NexPayload<DeleteCategoryRequest>,
  ): Promise<string> {
    return await this.inventoryService.deleteCategory(pl.data, chef);
  }
  /* ------------------------------------------------------------------------------------------------------------------ */

  @MessagePattern(PN.create_product, Transport.TCP)
  async handleCreateProduct(
    @CurrentUser() chef: UserSession,
    @Payload() pl: NexPayload<CreateProductDTO>,
  ): Promise<ReadProductDTO> {
    return await this.inventoryService.createProduct(pl.data, chef);
  }

  @MessagePattern(PN.update_product, Transport.TCP)
  async handleUpdateProduct(
    @CurrentUser() chef: UserSession,
    @Payload() pl: NexPayload<UpdateProductDTO>,
  ): Promise<ReadProductDTO> {
    return await this.inventoryService.updateProduct(pl.data, chef);
  }

  @MessagePattern(PN.delete_product, Transport.TCP)
  async handleDeleteProduct(
    @CurrentUser() chef: UserSession,
    @Payload() pl: NexPayload<DeleteProductRequest>,
  ): Promise<string> {
    return await this.inventoryService.deleteProduct(pl.data, chef);
  }
}
