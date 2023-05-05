import { AppDataSource } from '../../dataSource';
import { Planet } from '../../entities/Planet';

const planetRepository = AppDataSource.getRepository(Planet);

async function addPlanet(
  planetType: string,
  inhabitability: boolean,
  rings: boolean,
  size: string,
  moons: number
): Promise<Planet> {
  let newPlanet = new Planet();
  newPlanet.planetType = planetType;
  newPlanet.inhabitability = inhabitability;
  newPlanet.rings = rings;
  newPlanet.moons = moons;
  if (size === 'small') {
    newPlanet.size = Math.floor(Math.random() * 3) + 1;
  } else if (size === 'medium') {
    newPlanet.size = Math.floor(Math.random() * 7) + 1;
  } else {
    newPlanet.size = Math.floor(Math.random() * 10) + 1;
  }
  newPlanet = await planetRepository.save(newPlanet);
  return newPlanet;
}

export { addPlanet };
