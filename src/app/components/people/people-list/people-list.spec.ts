// people-list.spec.ts
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { PeopleList } from './people-list';
import { PeopleListService } from './people-list-service';
import { PeopleDetailService } from '../people-detail/people-detail-service';
import { MatDialog } from '@angular/material/dialog';

import type { Person } from '../../../shared/types/person';
import type { PersonRaw } from '../../../shared/types/swapi-person';
import { ActivatedRoute } from '@angular/router';

describe('PeopleList', () => {
  let fixture: ComponentFixture<PeopleList>;
  let component: PeopleList;

  const luke: Person = {
    id: 1,
    name: 'Luke Skywalker',
    url: 'https://swapi.dev/api/people/1/',
    birth_year: '19BBY',
    gender: 'male',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    homeworld: 'https://swapi.dev/api/planets/1/',
    films: ['A New Hope'],
    species: [],
    vehicles: [],
    starships: ['X-wing'],
    created: '2025-01-01T00:00:00.000Z',
    edited: '2025-01-01T00:00:00.000Z',
  };

  const leia: Person = {
    id: 5,
    name: 'Leia Organa',
    url: 'https://swapi.dev/api/people/5/',
    birth_year: '19BBY',
    gender: 'female',
    height: '150',
    mass: '49',
    hair_color: 'brown',
    skin_color: 'light',
    eye_color: 'brown',
    homeworld: 'https://swapi.dev/api/planets/2/',
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
    films: ['A New Hope'],
    species: [],
    vehicles: [],
    starships: ['Millennium Falcon'],
    created: '2025-01-02T00:00:00.000Z',
    edited: '2025-01-02T00:00:00.000Z',
  };

  let peopleSignal = signal<Person[]>([]);
  const peopleListServiceMock = {
    peopleSignal,
    getPersonId: jasmine.createSpy('getPersonId'),
    removePerson: jasmine.createSpy('removePerson'),
    addPerson: jasmine.createSpy('addPerson'),
  };

  const setActiveSpy = jasmine.createSpy('setActivePerson');
  const peopleDetailServiceMock = {
    set activePerson(p: Person) {
      setActiveSpy(p);
    },
  };

  const afterClosed$ = new Subject<PersonRaw | null | undefined>();
  const matDialogMock = {
    open: jasmine.createSpy('open').and.returnValue({
      afterClosed: () => afterClosed$.asObservable(),
    }),
  };

  beforeEach(async () => {
    peopleSignal = signal<Person[]>([]);
    peopleListServiceMock.peopleSignal = peopleSignal;
    peopleListServiceMock.getPersonId.calls.reset();
    peopleListServiceMock.removePerson.calls.reset();
    peopleListServiceMock.addPerson.calls.reset();
    (matDialogMock.open as jasmine.Spy).calls.reset();
    setActiveSpy.calls.reset();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PeopleList],
      providers: [
        { provide: PeopleListService, useValue: peopleListServiceMock },
        { provide: PeopleDetailService, useValue: peopleDetailServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: ActivatedRoute, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleList);
    component = fixture.componentInstance;

    peopleSignal.set([luke, leia]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.people()).toEqual([luke, leia]);
  });

  it('setActivePerson sollte Service-Setter aufrufen und Flag setzen', () => {
    expect(component['hasActivePerson']).toBeFalse();
    component.setActivePerson(leia);
    expect(setActiveSpy).toHaveBeenCalledWith(leia);
    expect(component['hasActivePerson']).toBeTrue();
  });

  it('getPersonId delegiert an PeopleListService', () => {
    component.getPersonId(luke);
    expect(peopleListServiceMock.getPersonId).toHaveBeenCalledWith(luke);
  });

  it('clear() leert das Suchfeld', () => {
    component['searchCtrl'].setValue('luke');
    component.clear();
    expect(component['searchCtrl'].value).toBe('');
  });

  it('removePerson delegiert an Service', () => {
    component.removePerson('Luke Skywalker');
    expect(peopleListServiceMock.removePerson).toHaveBeenCalledWith('Luke Skywalker');
  });

  describe('Suche (debounced)', () => {
    it('setzt isSearching=true und füllt searchResults nach 300ms', fakeAsync(() => {
      expect(component['isSearching']()).toBeFalse();
      component['searchCtrl'].setValue('le');
      tick(299);
      expect(component['isSearching']()).toBeFalse();
      tick(1); 
      expect(component['isSearching']()).toBeTrue();

      const results = component['searchResults']().map(p => p.name);
      expect(results).toEqual(['Leia Organa']);
    }));

    it('bei leerem/whitespace Term: isSearching=false und keine Suche', fakeAsync(() => {
      component['searchCtrl'].setValue('   ');
      tick(300);
      expect(component['isSearching']()).toBeFalse();
      expect(component['searchResults']()).toEqual([]);
    }));
  });

  describe('openAddPersonDialog Flow', () => {
    it('abgebrochener Dialog: kein addPerson, kein Alert', fakeAsync(() => {
      component.openAddPersonDialog();
      expect(matDialogMock.open).toHaveBeenCalled();

      afterClosed$.next(null);
      tick();

      expect(peopleListServiceMock.addPerson).not.toHaveBeenCalled();
      expect(component['showAlert']()).toBeFalse();
      expect(component['alertText']).toBe('');
    }));

    it('neue Person hinzugefügt: zeigt Yoda-Alert und auto-hide nach 5s', fakeAsync(() => {
      peopleListServiceMock.addPerson.and.returnValue(true);

      component.openAddPersonDialog();
      afterClosed$.next(rawNew);
      tick();

      expect(peopleListServiceMock.addPerson).toHaveBeenCalledWith(rawNew);
      expect(component['personAdded']).toBeTrue();
      expect(component['showAlert']()).toBeTrue();
      expect(component['alertText']).toBe('Eine neue Person hinzugefügt, du hast!');

      tick(4999);
      expect(component['showAlert']()).toBeTrue();
      tick(1);
      expect(component['showAlert']()).toBeFalse();
    }));

    it('Duplikat: zeigt Already-in-list-Alert und auto-hide', fakeAsync(() => {
      peopleListServiceMock.addPerson.and.returnValue(false);

      component.openAddPersonDialog();
      afterClosed$.next(rawNew);
      tick();

      expect(peopleListServiceMock.addPerson).toHaveBeenCalledWith(rawNew);
      expect(component['personAdded']).toBeFalse();
      expect(component['showAlert']()).toBeTrue();
      expect(component['alertText']).toBe('Schon in der Liste, die Person ist');

      tick(5000);
      expect(component['showAlert']()).toBeFalse();
    }));
  });
});
