import { Planet } from '../entities/Planet';

type SystemParams = {
  systemId: string;
};

type NewSystemRequest = {
  name: string;
  planets: Planet[];
};
