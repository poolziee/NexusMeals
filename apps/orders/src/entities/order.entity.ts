import { OrderStatus } from '@app/common/dto/orders/order-dto';
import { AutoMap } from '@automapper/classes';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderProductEntity } from './orderproduct.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @AutoMap()
  @Column()
  address: string;

  @AutoMap()
  @Column()
  username: string;

  @AutoMap()
  @Column()
  email: string;

  @AutoMap()
  @OneToMany(() => OrderProductEntity, (product) => product.order, {
    cascade: true,
    eager: true,
  })
  products: OrderProductEntity[];

  @AutoMap()
  @Column()
  chefId: string;

  @AutoMap()
  @Column()
  chefName: string;

  @AutoMap(() => String)
  @Column('text')
  status: OrderStatus;
}
