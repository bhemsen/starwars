import { Injectable, signal, Signal } from '@angular/core';
import { Person } from '../../../shared/types/person';
import { PersonRaw } from '../../../shared/types/swapi-person';

@Injectable({
  providedIn: 'root'
})
export class PeopleListService {
  private _people = signal<Person[]>([])
  readonly peopleSignal = this._people.asReadonly();

  set people(people: Person[]) {
    this._people.set(people)
  }

  get people() {
    return this._people();
  }

  getPersonId(person: Person): number {
    const url = person.url;
    const id = Number(url.split("/").pop());
    return id;
  }

  addPerson(person: PersonRaw): boolean {
    let added = false;

    const newPerson = {
      ...person,
      id: Math.random() * 1000
    }
    this._people.update(list => {
      const exists = list.some(p => p.name === person.name);
      if (exists) return list;
      added = true;
      return  [newPerson, ...list]
    });

    return added;
  }

  removePerson(name: string){
    this._people.update(list => list.filter(p => p.name !== name));
  }
}
