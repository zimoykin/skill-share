import { Skill } from 'src/skills/entities/skill.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'ssh_categories',
})
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @OneToMany(() => Skill, (skill) => skill.category)
  skills: Skill[];
}
