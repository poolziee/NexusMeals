import { PN, RMQ_ORDERS, RMQ_USERS } from '@app/common/constants';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CategoriesRepository, ProductsRepository } from './repositories';
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
  UpdateChefCategoryOverviewDTO,
  UpdateProductDTO,
  UserSession,
} from '@app/common/dto';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from './entities/category.entity';
import { AuthorizationError, ConflictError } from '@app/common/errors';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class InventoryService {
  constructor(
    private readonly productRepo: ProductsRepository,
    private readonly categoryRepo: CategoriesRepository,
    @Inject(RMQ_ORDERS) private rmqOrders: ClientProxy,
    @Inject(RMQ_USERS) private rmqUsers: ClientProxy,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private async update_chef_category_overview(category: ReadCategoryDTO): Promise<void> {
    await lastValueFrom(
      this.rmqUsers.emit(
        PN.update_chef_category_overview,
        new NexPayload(this.mapper.map(category, ReadCategoryDTO, UpdateChefCategoryOverviewDTO)),
      ),
    );
  }

  private async delete_chef_category_overview(req: DeleteCategoryRequest): Promise<void> {
    await lastValueFrom(this.rmqUsers.emit(PN.delete_chef_category_overview, new NexPayload(req)));
  }

  private async add_product_to_chef_category_overview(categoryId: number): Promise<void> {
    await lastValueFrom(this.rmqUsers.emit(PN.add_product_to_chef_category_overview, new NexPayload({ categoryId })));
  }

  private async remove_product_from_chef_category_overview(categoryId: number): Promise<void> {
    await lastValueFrom(
      this.rmqUsers.emit(PN.remove_product_from_chef_category_overview, new NexPayload({ categoryId })),
    );
  }

  async createCategory(req: CreateCategoryDTO, chef: UserSession): Promise<ReadCategoryDTO> {
    if (await this.categoryRepo.exists({ name: req.name })) {
      throw new ConflictError(`Category with name '${req.name}' already exists.`);
    }
    let category = this.mapper.map(req, CreateCategoryDTO, CategoryEntity);
    category.chefId = chef.id;
    category = await this.categoryRepo.save(category);
    const dto = this.mapper.map(category, CategoryEntity, ReadCategoryDTO);
    await this.update_chef_category_overview(dto);
    return dto;
  }

  async readCategoriesByChefId(req: ReadCategoryRequest): Promise<ReadCategoryDTO[] | ReadCategoryNoProductsDTO[]> {
    const categories = await this.categoryRepo.findAllBy({ chefId: req.chefId });
    if (req.withProducts) {
      return this.mapper.mapArray(categories, CategoryEntity, ReadCategoryDTO);
    } else {
      return this.mapper.mapArray(categories, CategoryEntity, ReadCategoryNoProductsDTO);
    }
  }

  async updateCategory(req: UpdateCategoryDTO, chef: UserSession): Promise<ReadCategoryDTO> {
    let category = await this.categoryRepo.findOneById(req.id);
    if (!category) {
      throw new ConflictError(`Trying to update a category that does not exist.`);
    }
    if (category.chefId !== chef.id) {
      throw new AuthorizationError('Trying to update a category that does not belong to you.');
    }
    category.name = req.name;
    category.description = req.description;
    category = await this.categoryRepo.save(category);
    const dto = this.mapper.map(category, CategoryEntity, ReadCategoryDTO);
    await this.update_chef_category_overview(dto);
    return dto;
  }

  async deleteCategory(req: DeleteCategoryRequest, chef: UserSession): Promise<string> {
    const category = await this.categoryRepo.findOneById(req.id);
    if (!category) {
      throw new ConflictError(`Trying to delete a category that does not exist.`);
    }
    if (category.chefId !== chef.id) {
      throw new AuthorizationError('Trying to delete a category that does not belong to you.');
    }
    await this.productRepo.delete({ category: category });
    await this.categoryRepo.remove(category);
    await this.delete_chef_category_overview(req);
    return `Deleted category '${category.name}'.`;
  }

  /* ------------------------------------------------------------------------------------------------------------------ */

  async createProduct(req: CreateProductDTO, chef: UserSession): Promise<ReadProductDTO> {
    if (await this.productRepo.exists({ name: req.name })) {
      throw new ConflictError(`Product with name '${req.name}' already exists.`);
    }
    const category = await this.categoryRepo.findOneById(req.categoryId);
    if (!category) {
      throw new ConflictError(`Trying to create a product with non-existent category.`);
    }
    if (category.chefId !== chef.id) {
      throw new AuthorizationError('Trying to create a product with a category that does not belong to you.');
    }
    let product = this.mapper.map(req, CreateProductDTO, ProductEntity);
    product.chefId = chef.id;
    product.category = category;
    product = await this.productRepo.save(product);
    await this.add_product_to_chef_category_overview(req.categoryId);
    return this.mapper.map(product, ProductEntity, ReadProductDTO);
  }

  async updateProduct(req: UpdateProductDTO, chef: UserSession): Promise<ReadProductDTO> {
    let product = await this.productRepo.findOneById(req.id);
    if (!product) {
      throw new ConflictError(`Trying to update a product that does not exist.`);
    }
    if (product.chefId !== chef.id) {
      throw new AuthorizationError('Trying to update a product that does not belong to you.');
    }
    const category = await this.categoryRepo.findOneById(req.categoryId);
    if (!category) {
      throw new ConflictError(`Trying to update a product with non-existent category.`);
    }
    if (category.chefId !== chef.id) {
      throw new AuthorizationError('Trying to update a product with a category that does not belong to you.');
    }
    product.name = req.name;
    product.description = req.description;
    product.quantity = req.quantity;
    product.category = category;
    product = await this.productRepo.save(product);
    return this.mapper.map(product, ProductEntity, ReadProductDTO);
  }

  async deleteProduct(req: DeleteProductRequest, chef: UserSession): Promise<string> {
    const product = await this.productRepo.findOneWithRelations({ where: { id: req.id }, relations: ['category'] });
    if (!product) {
      throw new ConflictError(`Trying to delete a product that does not exist.`);
    }
    if (product.chefId !== chef.id) {
      throw new AuthorizationError('Trying to delete a product that does not belong to you.');
    }
    await this.productRepo.remove(product);
    await this.remove_product_from_chef_category_overview(product.category.id);
    return `Deleted product '${product.name}'.`;
  }
}
