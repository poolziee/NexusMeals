import { AutoMap } from '@automapper/classes';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('increment')
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  chefId: number;

  @Column()
  @AutoMap()
  description: string;

  @OneToMany(() => ProductEntity, (product) => product.category, { eager: true })
  @AutoMap()
  products: ProductEntity[];
}
