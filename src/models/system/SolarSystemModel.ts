import { AppDataSource } from '../../dataSource';
import { SolarSystem } from '../../entities/SolarSystem';
import { User } from '../../entities/User';
import { Planet } from '../../entities/Planet';

const solarSystemRepository = await AppDataSource.getRepository(SolarSystem);

async function addSolarSystem(
  name: string,
  creator: User,
  planets: Planet[]
): Promise<SolarSystem> {
  let newSystem = new SolarSystem();
  newSystem.name = name;
  newSystem.user = creator;
  newSystem.planets = planets;
  newSystem = await solarSystemRepository.save(newSystem);
  return newSystem;
}

async function getSystemById(systemId: string): Promise<SolarSystem | null> {
  const system = await solarSystemRepository.findOne({
    select: {},
    where: { systemId },
  });
  return system;
}

export { addSolarSystem, getSystemById };
