type Planet = import('../entities/Planet').Planet;

type SystemParams = {
  systemId: string;
};

type NewSystemRequest = {
  name: string;
  starType: string;
  planetType: string[];
  inhabitability: boolean[];
  rings: boolean[];
  size: string[];
  moons: number[];
};
