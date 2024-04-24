import { Role } from '@app/common/roles';
import { AutoMap } from '@automapper/classes';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  role: Role;

  @AutoMap()
  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;
}
