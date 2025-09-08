// person.resolver.spec.ts
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from '../shared/services/api/api'; 
import { LoadingStateService } from '../shared/services/loading/loading-state-service';
import { PeopleDetailService } from '../components/people/people-detail/people-detail-service';
import type { Person } from '../shared/types/person';
import { personResolver } from './person-resolver';

describe('personResolver', () => {
  let api: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;
  let loading: { isLoading: boolean };
  let setActiveSpy: jasmine.Spy;

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

  beforeEach(() => {
    api = jasmine.createSpyObj<ApiService>('ApiService', ['getPerson']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.resolveTo(true);

    loading = { isLoading: false };

    setActiveSpy = jasmine.createSpy('setActivePerson');
    const peopleDetailSvcMock = {
      set activePerson(p: Person) { setActiveSpy(p); },
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: api },
        { provide: LoadingStateService, useValue: loading },
        { provide: PeopleDetailService, useValue: peopleDetailSvcMock },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('success: setzt Loading=true, schreibt activePerson, navigiert nicht und setzt Loading=false (finalize)', async () => {
    api.getPerson.and.returnValue(of(luke));

    const obs = TestBed.runInInjectionContext(() =>
      personResolver({ params: { id: 1 } } as any, {} as any)
    ) as unknown as Observable<Person>;

    expect(loading.isLoading).toBeTrue();

    const result = await lastValueFrom(obs);
    expect(result).toEqual(luke);
    expect(setActiveSpy).toHaveBeenCalledOnceWith(luke);
    expect(router.navigate).not.toHaveBeenCalled();

    expect(loading.isLoading).toBeFalse();
  });

  it('error: navigiert zu /error-404, rethrowed Fehler und setzt Loading=false', async () => {
    const err = new Error('down');
    api.getPerson.and.returnValue(throwError(() => err));

    const obs = TestBed.runInInjectionContext(() =>
      personResolver({ params: { id: 999 } } as any, {} as any)
    ) as unknown as Observable<Person>;

    expect(loading.isLoading).toBeTrue();

    await expectAsync(lastValueFrom(obs)).toBeRejectedWith(err);
    expect(router.navigate).toHaveBeenCalledWith(['/error-404']);
    expect(loading.isLoading).toBeFalse();
  });
});
