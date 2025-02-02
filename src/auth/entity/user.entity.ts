import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Auth } from './auth.entity';

@Entity({
  name: 'ssh_users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  gitHubId?: string;

  @Column()
  username: string;

  @Column()
  displayName: string;

  @Column({
    nullable: true,
  })
  avatar?: string;

  @OneToOne(() => Auth, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  parent?: Auth;

  @Column({
    nullable: false,
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  token?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
