import { User } from '../../auth/entity/user.entity';
import { Category } from '../../categories/entity/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'ssh_skills',
})
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  image?: string;

  @ManyToOne(() => Category, (category) => category.skills, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => User, (user) => user.parent, { onDelete: 'NO ACTION' })
  user: User;
}
