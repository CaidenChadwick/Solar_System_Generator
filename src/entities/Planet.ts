import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Moon } from './Moon';
import { SolarSystem } from './SolarSystem';

@Entity()
export class Planet {
  @PrimaryGeneratedColumn('uuid')
  planetId: string;

  @Column({ unique: true })
  planetType: string;

  @Column({ unique: true })
  size: string;

  @Column({ default: false })
  inhabitability: boolean;

  @Column({ default: false })
  rings: boolean;

  @ManyToOne(() => SolarSystem, (system) => system.planets)
  system: Relation<SolarSystem>;

  @OneToMany(() => Moon, (moon) => moon.planet)
  moons: Relation<Moon>[];
}
