// people-list.service.spec.ts
import { TestBed } from '@angular/core/testing';
import type { Person } from '../../../shared/types/person';
import type { PersonRaw } from '../../../shared/types/swapi-person';
import { PeopleListService } from './people-list-service';

describe('PeopleListService', () => {
  let service: PeopleListService;
  const originalRandom = Math.random;

  const personA: Person = {
    id: 1,
    name: 'Luke Skywalker',
    url: 'https://swapi.dev/api/people/1',
    birth_year: '19BBY',
    gender: 'male',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    homeworld: 'https://swapi.dev/api/planets/1',
    films: ['A New Hope'],
    species: [],
    vehicles: [],
    starships: ['X-wing'],
    created: '2025-01-01T00:00:00.000Z',
    edited: '2025-01-01T00:00:00.000Z',
  };

  const personB: Person = {
    id: 2,
    name: 'Leia Organa',
    url: 'https://swapi.dev/api/people/5',
    birth_year: '19BBY',
    gender: 'female',
    height: '150',
    mass: '49',
    hair_color: 'brown',
    skin_color: 'light',
    eye_color: 'brown',
    homeworld: 'https://swapi.dev/api/planets/2',
    films: ['A New Hope'],
    species: [],
    vehicles: [],
    starships: ['Tantive IV'],
    created: '2025-01-01T00:00:00.000Z',
    edited: '2025-01-01T00:00:00.000Z',
  };

  const rawNew: PersonRaw = {
    name: 'Han Solo',
    url: 'https://swapi.dev/api/people/14/',
    birth_year: '29BBY',
    gender: 'male',
    height: '180',
    mass: '80',
    hair_color: 'brown',
    skin_color: 'light',
    eye_color: 'brown',
    homeworld: 'https://swapi.dev/api/planets/22/',
    films: ['A New Hope', 'The Empire Strikes Back'],
    species: [],
    vehicles: [],
    starships: ['Millennium Falcon'],
    created: '2025-01-02T00:00:00.000Z',
    edited: '2025-01-02T00:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeopleListService],
    });
    service = TestBed.inject(PeopleListService);
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  it('should be created with empty list', () => {
    expect(service).toBeTruthy();
    expect(service.people).toEqual([]);
    expect(service.peopleSignal()).toEqual([]);
  });

  it('getPersonId should parse numeric id from url', () => {
    expect(service.getPersonId(personA)).toBe(1);
    expect(service.getPersonId(personB)).toBe(5);
  });

  it('addPerson should prepend non-existing by name and return true; generated id uses Math.random*1000', () => {
    service.people = [personA, personB];

    Math.random = () => 0.123;
    const added = service.addPerson(rawNew);

    expect(added).toBeTrue();
    const list = service.people;
    expect(list.length).toBe(3);
    expect(list[0].name).toBe('Han Solo'); 
    expect(list[0].id).toBeCloseTo(123, 0);
    expect(list[0].starships).toEqual(['Millennium Falcon']);
    expect(service.peopleSignal()[0].name).toBe('Han Solo');
  });

  it('addPerson should not add duplicate by name and return false', () => {
    service.people = [personA];
    const duplicateRaw: PersonRaw = { ...rawNew, name: 'Luke Skywalker' };
    const res = service.addPerson(duplicateRaw);
    expect(res).toBeFalse();
    expect(service.people.length).toBe(1);
    expect(service.people[0].name).toBe('Luke Skywalker');
  });

  it('removePerson should filter by name', () => {
    service.people = [personA, personB];
    service.removePerson('Luke Skywalker');
    expect(service.people.map(p => p.name)).toEqual(['Leia Organa']);
  });
});
