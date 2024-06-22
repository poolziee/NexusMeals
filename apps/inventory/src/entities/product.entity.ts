import { AutoMap } from '@automapper/classes';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity('products')
export class ProductEntity {
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
  chefName: string;

  @Column()
  @AutoMap()
  description: string;

  @Column()
  @AutoMap()
  quantity: number;

  @Column('decimal', { precision: 6, scale: 2 })
  @AutoMap()
  price: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @AutoMap()
  category: CategoryEntity;
}
