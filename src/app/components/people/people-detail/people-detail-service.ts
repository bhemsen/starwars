import { computed, Injectable, signal } from '@angular/core';
import { ProperyList } from '../../../shared/types/propery-list';
import { Person } from '../../../shared/types/person';

@Injectable({
  providedIn: 'root'
})
export class PeopleDetailService {
    private _activePerson = signal<Person | undefined>(undefined);
    readonly activePersonSignal  = this._activePerson.asReadonly();
    readonly personDisplayRows = computed<ProperyList[]>(() => {
      const p = this._activePerson();
      if (!p) return [];
      return [
        { label: 'Name',       value: p.name },
        { label: 'Größe',     value: !!p.height? `${p.height} cm` : 'n/a'},
        { label: 'Gewicht',       value:(!!p.mass && p.mass !== 'unknown')? `${p.mass} kg` : 'n/a' },
        { label: 'Geburtsjahr', value: p.birth_year },
        { label: 'Geschlecht',     value: p.gender },
      ];
    });

    set activePerson(person: Person | undefined) {
      this._activePerson.set(person);
    }

    get activePerson(): Person | undefined {
      return this._activePerson();
    }

}
