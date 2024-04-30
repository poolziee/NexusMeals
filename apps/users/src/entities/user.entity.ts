import { AutoMap } from '@automapper/classes';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChefCategoryOverviewEntity } from './chef.category.overview.entity';

@Entity('users')
export class UserEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @AutoMap()
  @Column()
  firstName: string;

  @AutoMap()
  @Column()
  lastName: string;

  @AutoMap()
  @Column({ unique: true })
  email: string;

  @AutoMap()
  @Column()
  passwordHash: string;

  @AutoMap()
  @Column()
  role: string;

  @AutoMap()
  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @AutoMap()
  @Column()
  city: string;

  @AutoMap()
  @Column()
  postalCode: string;

  @AutoMap()
  @Column()
  street: string;

  @AutoMap()
  @Column()
  houseNumber: string;

  @AutoMap()
  @OneToMany(() => ChefCategoryOverviewEntity, (categoryOverview) => categoryOverview.chef, {
    eager: true,
  })
  categoryOverview: ChefCategoryOverviewEntity[];
}
