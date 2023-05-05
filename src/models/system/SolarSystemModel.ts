import { AppDataSource } from '../../dataSource';
import { SolarSystem } from '../../entities/SolarSystem';
import { User } from '../../entities/User';
import { Planet } from '../../entities/Planet';

const solarSystemRepository = AppDataSource.getRepository(SolarSystem);

async function addSolarSystem(
  name: string,
  creator: User,
  planets: Planet[],
  starType: string
): Promise<SolarSystem> {
  let newSystem = new SolarSystem();
  newSystem.name = name;
  newSystem.user = creator;
  newSystem.planets = planets;
  newSystem.starType = starType;
  newSystem = await solarSystemRepository.save(newSystem);
  return newSystem;
}

async function getSystemById(systemId: string): Promise<SolarSystem | null> {
  const system = await solarSystemRepository.findOne({
    select: {
      name: true,
      starType: true,
      planets: true,
      systemId: true,
    },
    where: { systemId },
    relations: ['planets'],
  });

  return system;
}

async function getSystemByName(name: string): Promise<SolarSystem | null> {
  const system = await solarSystemRepository.findOne({
    select: {
      name: true,
      starType: true,
      planets: true,
      systemId: true,
    },
    where: { name },
    relations: ['planets'],
  });

  return system;
}

export { addSolarSystem, getSystemById, getSystemByName };
