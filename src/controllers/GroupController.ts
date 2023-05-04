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
import { getUserById } from '../models/UserModel';
import { getSystemById } from '../models/system/SolarSystemModel';

async function createGroup(req: Request, res: Response): Promise<void> {
  // check that user is signed in
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const { userId } = req.session.authenticatedUser;
  const user = await getUserById(userId);
  const { name } = req.body as NewGroupRequest;

  try {
    const newGroup = await addGroup(name, user);
    console.log(newGroup);
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

  const { targetUserId, groupId } = req.body as GroupUserRequest;
  const targetUser = await getUserById(targetUserId);
  const group = await getGroupById(groupId);

  // check that user exists and is signed in
  if (!targetUser) {
    res.render('group', { group });
    return;
  }

  // check that group exists

  if (!group) {
    res.render('profile');
    return;
  }

  if (!isUserOfGroup(groupId, targetUserId)) {
    res.render('group', { group });
    return;
  }

  // check join condition(password / invite)

  try {
    const updatedGroup = await addUserToGroup(targetUser, group);
    console.log(updatedGroup);
    res.render('group', { updatedGroup });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
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
  const group = await getGroupById(groupId);

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
    const updatedGroup = await deleteUserFromGroup(targetMember, group);
    console.log(updatedGroup);
    res.render('group', { updatedGroup });
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

  // check group exists
  const { groupId } = req.params as GroupSystemRequest;
  const { targetSystemId } = req.body as GroupSystemRequest;
  const group = await getGroupById(groupId);
  const targetSystem = await getSystemById(targetSystemId);
  if (!group || !targetSystem) {
    res.render('profile');
    return;
  }

  // check user adding is in group
  const { userId } = req.session.authenticatedUser;

  if (!isUserOfGroup(groupId, userId)) {
    res.render('profile');
    return;
  }

  // Check system owned by user

  // check system is not in group
  if (!isSystemOfGroup(groupId, targetSystemId)) {
    res.render('group', { group });
    return;
  }

  try {
    const addedSystem = await addSystemToGroup(targetSystem, group);
    console.log(addedSystem);
    res.sendStatus(200);
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
  const { groups } = await getUserById(userId);

  res.render('groupList', { groups });
}

export { createGroup, addMember, removeMember, addGroupSystem, removeGroupSystem, getUserGroups };
