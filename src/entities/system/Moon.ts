import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Planet } from './Planet';

@Entity()
export class Moon {
  @PrimaryGeneratedColumn('uuid')
  moonId: string;

  @Column({ default: false })
  inhabitability: boolean;

  @Column({ unique: true })
  size: string;

  @ManyToOne(() => Planet, (planet) => planet.moons)
  planet: Relation<Planet>[];
}
