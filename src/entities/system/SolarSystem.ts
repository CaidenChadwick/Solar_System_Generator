import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Planet } from './Planet';
import { Group } from '../Group';
import { User } from '../User';

@Entity()
export class SolarSystem {
  @PrimaryGeneratedColumn('uuid')
  systemId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  starType: string;

  @OneToMany(() => Planet, (planet) => planet.system)
  planets: Relation<Planet>[];

  @ManyToOne(() => User, (user) => user.systems)
  user: Relation<User>;

  @ManyToOne(() => Group, (group) => group.systems)
  group: Relation<Group>;
}
