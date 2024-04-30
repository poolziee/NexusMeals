import { AutoMap } from '@automapper/classes';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('chef_category_overviews')
export class ChefCategoryOverviewEntity {
  @AutoMap()
  @PrimaryColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column()
  description: string;

  @AutoMap()
  @Column({ default: 0 })
  totalProducts: number;

  @AutoMap()
  @ManyToOne(() => UserEntity, (chef) => chef.categoryOverview)
  chef: UserEntity;
}
