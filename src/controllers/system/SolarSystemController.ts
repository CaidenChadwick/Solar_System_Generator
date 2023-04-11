import { Request, Response } from 'express';
import { parseDatabaseError } from '../../utils/db-utils';

import { addSolarSystem } from '../../models/system/SolarSystemModel';
import { getUserById } from '../../models/UserModel';

async function createSolarSystem(req: Request, res: Response): Promise<void> {
  const { name } = req.body as NewSystemRequest;

  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const { userId } = req.session.authenticatedUser;
  const user = await getUserById(userId);

  try {
    const newSystem = await addSolarSystem(name, user);
    console.log(newSystem);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

export { createSolarSystem };
