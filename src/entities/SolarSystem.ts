import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Planet } from './Planet';
import { Systems } from './Systems';

@Entity()
export class SolarSystem {
  @PrimaryGeneratedColumn('uuid')
  systemId: string;

  @Column({ unique: true })
  starType: string;

  @OneToMany(() => Planet, (planet) => planet.system)
  planets: Relation<Planet>[];

  @ManyToOne(() => Systems, (system) => system.solarSystems)
  system: Relation<Systems>[];
}
