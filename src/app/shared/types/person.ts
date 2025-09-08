import { PersonRaw } from "./swapi-person";

export interface Person extends PersonRaw {
  id: number;
}