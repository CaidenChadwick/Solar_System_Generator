import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  ManyToOne,
  Relation,
  JoinTable,
} from 'typeorm';
import { User } from './User';
import { SolarSystem } from './SolarSystem';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  groupId: string;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => User, (owner) => owner.ownedGroups, { cascade: ['insert', 'update'] })
  owner: Relation<User>;

  @ManyToMany(() => User, (user) => user.groups, { cascade: ['insert', 'update'] })
  @JoinTable()
  members: Relation<User>[];

  @OneToMany(() => SolarSystem, (system) => system.group, { cascade: ['insert', 'update'] })
  systems: Relation<SolarSystem>[];
}
