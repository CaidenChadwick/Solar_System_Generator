import { AppDataSource } from '../dataSource';
import { Group } from '../entities/Group';
import { User } from '../entities/User';
import { SolarSystem } from '../entities/SolarSystem';

const groupRepository = AppDataSource.getRepository(Group);

async function addGroup(name: string, creator: User): Promise<Group> {
  let newGroup = new Group();
  newGroup.name = name;
  newGroup.owner = creator;
  newGroup.members = [];
  newGroup.systems = [];
  newGroup = await groupRepository.save(newGroup);
  return newGroup;
}

async function addSystemToGroup(newSystem: SolarSystem, group: Group): Promise<Group> {
  group.systems.push(newSystem);
  const updatedGroup = await groupRepository.save(group);
  return updatedGroup;
}

async function deleteSystemFromGroup(system: SolarSystem, group: Group): Promise<Group> {
  group.systems.splice(group.systems.indexOf(system), 1);
  const updatedGroup = await groupRepository.save(group);
  return updatedGroup;
}

async function addUserToGroup(newUser: User, group: Group): Promise<Group> {
  group.members.push(newUser);
  const updatedGroup = await groupRepository.save(group);
  return updatedGroup;
}

async function deleteUserFromGroup(user: User, group: Group): Promise<Group> {
  group.members.splice(group.members.indexOf(user), 1);
  const updatedGroup = await groupRepository.save(group);
  return updatedGroup;
}

async function getGroupById(groupId: string): Promise<Group | null> {
  return groupRepository
    .createQueryBuilder('group')
    .leftJoinAndSelect('group.members', 'members')
    .leftJoinAndSelect('group.systems', 'systems')
    .leftJoinAndSelect('group.owner', 'owner')
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

async function isOwner(groupId: string, userId: string): Promise<boolean> {
  return groupRepository
    .createQueryBuilder('group')
    .leftJoinAndSelect('group.owner', 'owner')
    .where('groupId = :groupId', { groupId })
    .andWhere('owner.userId = :userId', { userId })
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

export {
  addGroup,
  getGroupById,
  addSystemToGroup,
  deleteSystemFromGroup,
  addUserToGroup,
  deleteUserFromGroup,
  isUserOfGroup,
  isOwner,
  isSystemOfGroup,
};
