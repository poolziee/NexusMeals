import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { AutoMap } from '@automapper/classes';

@Entity('order_products')
export class OrderProductEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @AutoMap()
  @Column()
  real_id: string;

  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  description: string;

  @Column()
  @AutoMap()
  quantity: number;

  @Column('decimal', { precision: 6, scale: 2 })
  @AutoMap()
  price: number;

  @AutoMap()
  @ManyToOne(() => OrderEntity, (order) => order.products)
  order: OrderEntity;
}
