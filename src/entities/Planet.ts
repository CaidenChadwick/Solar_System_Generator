import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { SolarSystem } from './SolarSystem';

@Entity()
export class Planet {
  @PrimaryGeneratedColumn('uuid')
  planetId: string;

  @Column()
  planetType: string;

  @Column()
  size: number;

  @Column({ default: false })
  inhabitability: boolean;

  @Column({ default: false })
  rings: boolean;

  @Column({ default: 1 })
  moons: number;

  @ManyToOne(() => SolarSystem, (system) => system.planets)
  system: Relation<SolarSystem>;
}
