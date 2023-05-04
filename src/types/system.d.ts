type Planet = import('../entities/Planet').Planet;

type SystemParams = {
  systemId: string;
};

type NewSystemRequest = {
  name: string;
  starType: string;
  planets: Planet[];
};
