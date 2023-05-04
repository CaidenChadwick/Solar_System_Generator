import { Request, Response } from 'express';
import { parseDatabaseError } from '../../utils/db-utils';

import { addSolarSystem, getSystemById } from '../../models/system/SolarSystemModel';
import { getUserById } from '../../models/UserModel';

async function createSolarSystem(req: Request, res: Response): Promise<void> {
  const { name, planets, starType } = req.body as NewSystemRequest;

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const { userId } = req.session.authenticatedUser;
  const user = await getUserById(userId);

  try {
    const newSystem = await addSolarSystem(name, user, planets, starType);
    console.log(newSystem);
    const { systems } = user;
    res.render('systems', { systems });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getSystem(req: Request, res: Response): Promise<void> {
  const { systemId } = req.params as SystemParams;

  const system = await getSystemById(systemId);

  if (!system) {
    res.render('profile');
    return;
  }

  res.render('system', { system });
}

async function getUserSystems(req: Request, res: Response): Promise<void> {
  const { userId } = req.session.authenticatedUser;
  const { systems } = await getUserById(userId);

  res.render('systems', { systems });
}

export { createSolarSystem, getSystem, getUserSystems };
