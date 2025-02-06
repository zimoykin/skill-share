import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Auth } from './auth.entity';
import { Skill } from 'src/skills/entities/skill.entity';

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

  @OneToMany(() => Skill, (skill) => skill.user, { eager: false })
  skill?: Skill;

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
