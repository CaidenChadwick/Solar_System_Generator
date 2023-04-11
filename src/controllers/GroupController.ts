import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';

import {
  addGroup,
  getGroupById,
  addSystemToGroup,
  addUserToGroup,
  isUserOfGroup,
  isSystemOfGroup,
} from '../models/GroupModel';
import { getUserById } from '../models/UserModel';
import { getSystemById } from '../models/system/SolarSystemModel';

async function createGroup(req: Request, res: Response): Promise<void> {
  // check that user is signed in
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
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
    res.sendStatus(401);
    return;
  }

  const { userId, groupId } = req.body as GroupUserRequest;
  const user = await getUserById(userId);
  const group = await getGroupById(groupId);

  // check that user exists and is signed in
  if (!user) {
    res.sendStatus(404);
    return;
  }

  // check that group exists

  if (!group) {
    res.sendStatus(404);
    return;
  }

  if (isUserOfGroup(groupId, userId)) {
    res.sendStatus(409);
    return;
  }

  // check join condition(password / invite)

  try {
    const addedUser = await addUserToGroup(user, group);
    console.log(addedUser);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function addGroupSystem(req: Request, res: Response): Promise<void> {
  // check login
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  // check group exists
  const { groupId } = req.params as GroupSystemRequest;
  const { systemId } = req.body as GroupSystemRequest;
  const group = await getGroupById(groupId);
  const system = await getSystemById(systemId);
  if (!group || !system) {
    res.sendStatus(404);
    return;
  }

  // check user adding is in group
  const { userId } = req.session.authenticatedUser;

  if (!isUserOfGroup(groupId, userId)) {
    res.sendStatus(403);
    return;
  }

  // Check system owned by user

  // check system is not in group
  if (isSystemOfGroup(groupId, systemId)) {
    res.sendStatus(409);
    return;
  }

  try {
    const addedSystem = await addSystemToGroup(system, group);
    console.log(addedSystem);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

export { createGroup, addMember, addGroupSystem };
