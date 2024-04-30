import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

interface HasId {
  id: number;
}

export abstract class AbstractRepository<T extends HasId> {
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }
  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.save(data);
  }
  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }
  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    };
    return await this.entity.findOneBy(options);
  }

  public async findOneBy(options: FindOptionsWhere<T>): Promise<T> {
    return await this.entity.findOneBy(options);
  }

  public async findOne(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(filterCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findOneWithRelations(relations: FindManyOptions<T>): Promise<T> {
    return await this.entity.findOne(relations);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async findAllBy(options: FindOptionsWhere<T>): Promise<T[]> {
    return await this.entity.find({ where: options });
  }

  public async remove(data: T): Promise<T> {
    return await this.entity.remove(data);
  }

  public async delete(options: FindOptionsWhere<T>): Promise<void> {
    await this.entity.delete(options);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike);
  }

  public async exists(options: FindOptionsWhere<T>): Promise<boolean> {
    return await this.entity.exists({ where: options });
  }
}
