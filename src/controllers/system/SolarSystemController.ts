import { Request, Response } from 'express';
import { parseDatabaseError } from '../../utils/db-utils';

import { addSolarSystem, getSystemById } from '../../models/system/SolarSystemModel';
import { getUserById } from '../../models/UserModel';
import { addPlanet } from '../../models/system/PlanetModel';
import { Planet } from '../../entities/Planet';

async function createSolarSystem(req: Request, res: Response): Promise<void> {
  const { name, starType, planetType, inhabitability, rings, size, moons } =
    req.body as NewSystemRequest;

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const planets: Planet[] = [];
  for (let i = 0; i < planetType.length; i += 1) {
    const planet = await addPlanet(planetType[i], inhabitability[i], rings[i], size[i], moons[i]);
    planets.push(planet);
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
  console.log(system);

  if (!system) {
    res.sendStatus(404);
    return;
  }

  res.render('system', { system });
}

async function getUserSystems(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.sendStatus(403);
    return;
  }
  const { userId } = req.session.authenticatedUser;
  const { systems } = await getUserById(userId);

  res.render('systems', { systems });
}

export { createSolarSystem, getSystem, getUserSystems };
