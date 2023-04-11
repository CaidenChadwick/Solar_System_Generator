import { Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { SolarSystem } from './SolarSystem';

@Entity()
export class Systems {
  @PrimaryGeneratedColumn('uuid')
  systemsId: string;

  @OneToMany(() => SolarSystem, (solarSystem) => solarSystem.system)
  solarSystems: Relation<SolarSystem>[];
}
