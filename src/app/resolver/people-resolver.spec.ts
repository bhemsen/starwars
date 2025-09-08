import { TestBed } from '@angular/core/testing';
import { of, throwError, lastValueFrom, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { PeopleListService } from '../components/people/people-list/people-list-service';
import { ApiService } from '../shared/services/api/api';
import { LoadingStateService } from '../shared/services/loading/loading-state-service';
import { peopleResolver } from './people-resolver';

describe('peopleResolver', () => {
  let api: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;
  let loading: { isLoading: boolean };
  const svcStore: { people?: any[] } = {};
  const listSvcMock = {
    getPersonId: jasmine.createSpy('getPersonId').and.callFake((p: any) => p.url.endsWith('/1/') ? 1 : 5),
    set people(v: any[]) { svcStore.people = v; },
    get people() { return svcStore.people!; },
  };

  beforeEach(() => {
    api = jasmine.createSpyObj<ApiService>('ApiService', ['getPeople']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.resolveTo(true);
    loading = { isLoading: false };

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: api },
        { provide: PeopleListService, useValue: listSvcMock }, 
        { provide: LoadingStateService, useValue: loading },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('it should success', async () => {
    const peopleFromApi = [
      { url: '.../people/1/' }, { url: '.../people/5/' },
    ] as any[];

    api.getPeople.and.returnValue(of(peopleFromApi));

    const obs = TestBed.runInInjectionContext(() =>
      peopleResolver({} as any, {} as any)
    ) as unknown as Observable<any[]>;

    expect(loading.isLoading).toBeTrue();

    const res = await lastValueFrom(obs);
    expect(res.map(p => p.id)).toEqual([1, 5]);
    expect(svcStore.people?.length).toBe(2);
    expect(loading.isLoading).toBeFalse();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should throw an error', async () => {
    const err = new Error('API kaputt');
    api.getPeople.and.returnValue(throwError(() => err));

    const obs = TestBed.runInInjectionContext(() =>
      peopleResolver({} as any, {} as any)
    ) as unknown as Observable<any[]>;

    expect(loading.isLoading).toBeTrue();
    await expectAsync(lastValueFrom(obs)).toBeRejectedWith(err);
    expect(router.navigate).toHaveBeenCalledWith(['/error-404']);
    expect(loading.isLoading).toBeFalse();
  });
});
