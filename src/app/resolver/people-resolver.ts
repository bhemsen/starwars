import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { PeopleListService } from '../components/people/people-list/people-list-service';
import { ApiService } from '../shared/services/api/api';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { LoadingStateService } from '../shared/services/loading/loading-state-service';
import { Person } from '../shared/types/person';

export const peopleResolver: ResolveFn<Observable<Person[]>> = (route, state) => {
  const peopleListService: PeopleListService = inject(PeopleListService);
  const apiService: ApiService = inject(ApiService);
  const loadingStateService: LoadingStateService = inject(LoadingStateService)
  const router: Router = inject(Router);
  
  loadingStateService.isLoading = true;
  return apiService.getPeople().pipe(
    map(people =>
      people.map(p => ({ ...p, id: peopleListService.getPersonId(p) }))
    ),
    tap(people => peopleListService.people = people),
    finalize(() => { loadingStateService.isLoading = false; }),
    catchError(err => {
      loadingStateService.isLoading = false
      router.navigate(['/error-404']); 
      return throwError(() => err);
    }),
  );
};
