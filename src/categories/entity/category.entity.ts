import { Skill } from 'src/skills/entities/skill.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'ssh_categories',
})
export class Category {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  image?: string;

  @OneToMany(() => Skill, (skill) => skill.category)
  skills: Skill[];
}
