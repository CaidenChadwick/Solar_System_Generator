import { AppDataSource } from '../dataSource';
import { Group } from '../entities/Group';
import { User } from '../entities/User';
import { SolarSystem } from '../entities/system/SolarSystem';

const groupRepository = AppDataSource.getRepository(Group);

async function addGroup(name: string, creator: User): Promise<Group> {
  let newGroup = new Group();
  newGroup.name = name;
  newGroup.owner = creator;
  newGroup = await groupRepository.save(newGroup);
  return newGroup;
}

async function addSystemToGroup(newSystem: SolarSystem, group: Group): Promise<Group> {
  group.systems.push(newSystem);
  const updatedGroup = await groupRepository.save(group);
  return updatedGroup;
}

async function addUserToGroup(newUser: User, group: Group): Promise<Group> {
  group.members.push(newUser);
  const updatedGroup = await groupRepository.save(group);
  return updatedGroup;
}

// TODO: async function removeUserFromGroup(): Promise<Group> { }

async function getGroupById(groupId: string): Promise<Group | null> {
  return groupRepository
    .createQueryBuilder('group')
    .leftJoinAndSelect('group.members', 'members')
    .leftJoinAndSelect('group.systems', 'systems')
    .where('groupId = :groupId', { groupId })
    .getOne();
}

async function isUserOfGroup(groupId: string, userId: string): Promise<boolean> {
  return groupRepository
    .createQueryBuilder('group')
    .leftJoinAndSelect('group.members', 'members')
    .where('groupId = :groupId', { groupId })
    .andWhere('members.userId = :userId', { userId })
    .getExists();
}

async function isSystemOfGroup(groupId: string, systemId: string): Promise<boolean> {
  return groupRepository
    .createQueryBuilder('group')
    .leftJoinAndSelect('group.systems', 'systems')
    .where('groupId = :groupId', { groupId })
    .andWhere('members.systemId = :systemId', { systemId })
    .getExists();
}

export { addGroup, getGroupById, addUserToGroup, addSystemToGroup, isUserOfGroup, isSystemOfGroup };
