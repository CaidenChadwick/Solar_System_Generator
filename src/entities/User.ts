import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, Relation } from 'typeorm';
import { Group } from './Group';
import { SolarSystem } from './system/SolarSystem';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column({ default: 0 })
  profileViews: number;

  @OneToMany(() => SolarSystem, (system) => system.user)
  systems: Relation<SolarSystem>[];

  @ManyToMany(() => Group, (group) => group.members, { cascade: ['insert', 'update'] })
  groups: Relation<Group>[];
}
