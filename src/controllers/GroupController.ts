import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';

import {
  addGroup,
  getGroupById,
  addSystemToGroup,
  deleteSystemFromGroup,
  addUserToGroup,
  deleteUserFromGroup,
  isUserOfGroup,
  isOwner,
  isSystemOfGroup,
} from '../models/GroupModel';
import { getUserById, getUserByUsername } from '../models/UserModel';
import { getSystemById, getSystemByName } from '../models/system/SolarSystemModel';

async function getGroup(req: Request, res: Response): Promise<void> {
  const { groupId } = req.params as GroupIdParams;

  const group = await getGroupById(groupId);
  console.log(group);

  if (!group) {
    return;
  }

  res.render('group', { group, groupId });
}

async function createGroup(req: Request, res: Response): Promise<void> {
  // check that user is signed in
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const { userId } = req.session.authenticatedUser;
  const user = await getUserById(userId);
  const { name } = req.body as NewGroupRequest;

  if (!user) {
    res.sendStatus(404);
    return;
  }

  try {
    const group = await addGroup(name, user);
    console.log(group);
    res.redirect('/groups');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function addMember(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }
  const { userId } = req.session.authenticatedUser;

  const { username } = req.body as GroupUserRequest;
  console.log(username);
  const targetUser = await getUserByUsername(username);

  const { groupId } = req.params as GroupIdParams;
  let group = await getGroupById(groupId);

  if (!group) {
    res.redirect(`/profile/${userId}`);
    return;
  }

  // check that user exists and is signed in
  if (!targetUser) {
    // res.render('group', { group, groupId });
    res.send(`Could not find user: ${username}`);
    return;
  }
  console.log('\n\ntargetUser:');
  console.log(targetUser);
  console.log('\n\n');

  if (!isUserOfGroup(groupId, targetUser.userId)) {
    res.send(`User already in group: ${username}`);
    return;
  }

  // check join condition(password / invite)

  try {
    await addUserToGroup(targetUser, group);
    group = await getGroupById(groupId);
    console.log('\n\nGroup:');
    console.log(group);
    res.redirect(`/api/groups/${groupId}`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function goAddMember(req: Request, res: Response): Promise<void> {
  const { groupId } = req.params as GroupIdParams;

  res.render('addMember', { groupId });
}

async function goAddSystem(req: Request, res: Response): Promise<void> {
  const { groupId } = req.params as GroupIdParams;

  res.render('addSystem', { groupId });
}

async function removeMember(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const { targetUserId, groupId } = req.params as GroupUserRequest;

  const { userId } = req.session.authenticatedUser;
  if (!isOwner(groupId, userId)) {
    res.sendStatus(403);
    return;
  }

  const targetMember = await getUserById(targetUserId);
  let group = await getGroupById(groupId);

  if (!group) {
    res.render('profile');
    return;
  }
  if (!targetMember) {
    res.render('group', { group });
    return;
  }

  if (!isUserOfGroup(groupId, targetUserId)) {
    res.render('group', { group });
    return;
  }

  try {
    group = await deleteUserFromGroup(targetMember, group);
    console.log(group);
    res.render('group', { group });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function addGroupSystem(req: Request, res: Response): Promise<void> {
  // check login
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }
  const { userId } = req.session.authenticatedUser;
  const { username } = req.params as GroupUserRequest;

  const { name } = req.body as GroupSystemRequest;
  const targetSystem = await getSystemByName(name);

  // check group exists
  const { groupId } = req.params as GroupSystemRequest;
  let group = await getGroupById(groupId);

  if (!group) {
    res.redirect(`/profile/${userId}`);
    return;
  }

  if (!targetSystem) {
    res.send(`Could not find system: ${name}`);
  }

  // check user adding is in group
  if (!isUserOfGroup(groupId, userId)) {
    res.send(`User already in group: ${username}`);
    return;
  }

  // Check system owned by user

  // check system is not in group
  if (!isSystemOfGroup(groupId, targetSystem.systemId)) {
    res.send(`System already in group: ${name}`);
    return;
  }

  try {
    await addSystemToGroup(targetSystem, group);
    group = await getGroupById(groupId);
    res.redirect(`/api/groups/${groupId}`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function removeGroupSystem(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const { targetSystemId, groupId } = req.params as GroupSystemRequest;

  const { userId } = req.session.authenticatedUser;
  if (!isOwner(groupId, userId)) {
    res.sendStatus(403);
    return;
  }

  const targetSystem = await getSystemById(targetSystemId);
  const group = await getGroupById(groupId);

  if (!group) {
    res.sendStatus(404);
    return;
  }
  if (!targetSystem) {
    res.sendStatus(404);
    return;
  }

  if (!isSystemOfGroup(groupId, targetSystemId)) {
    res.sendStatus(404);
    return;
  }

  try {
    const updatedGroup = await deleteSystemFromGroup(targetSystem, group);
    console.log(updatedGroup);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getUserGroups(req: Request, res: Response): Promise<void> {
  const { isLoggedIn } = req.session;

  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const { userId } = req.session.authenticatedUser;
  const { groups, ownedGroups } = await getUserById(userId);

  console.log('HIHIHI');
  res.render('groups', { groups, ownedGroups });
}

export {
  getGroup,
  createGroup,
  addMember,
  goAddMember,
  goAddSystem,
  removeMember,
  addGroupSystem,
  removeGroupSystem,
  getUserGroups,
};
