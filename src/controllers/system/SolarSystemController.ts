import { Request, Response } from 'express';
import { parseDatabaseError } from '../../utils/db-utils';

import { addSolarSystem, getSystemById } from '../../models/system/SolarSystemModel';
import { getUserById } from '../../models/UserModel';

async function createSolarSystem(req: Request, res: Response): Promise<void> {
  const { name } = req.body as NewSystemRequest;

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const { userId } = req.session.authenticatedUser;
  const user = await getUserById(userId);

  try {
    const newSystem = await addSolarSystem(name, user);
    console.log(newSystem);
    res.render('/systems');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getSystem(req: Request, res: Response): Promise<void> {
  const { systemId } = req.params as SystemParams;

  const system = getSystemById(systemId);

  if (!system) {
    res.sendStatus(404);
    return;
  }

  res.status(200).json(system);
}

export { createSolarSystem, getSystem };
