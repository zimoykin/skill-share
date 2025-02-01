import { Category } from '../../categories/entity/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'ssh_skills',
})
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
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

  @ManyToOne(() => Category, (category) => category.skills)
  category: Category;
}
