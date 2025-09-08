import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, finalize, throwError, tap, Observable } from 'rxjs';
import { ApiService } from '../shared/services/api/api';
import { LoadingStateService } from '../shared/services/loading/loading-state-service';
import { PeopleDetailService } from '../components/people/people-detail/people-detail-service';
import { Person } from '../shared/types/person';

export const personResolver: ResolveFn<Observable<Person>> = (route, state) => {
  const peopleDetailService: PeopleDetailService = inject(PeopleDetailService);
  const apiService: ApiService = inject(ApiService);
  const loadingStateService: LoadingStateService = inject(LoadingStateService);
  const router: Router = inject(Router);

  loadingStateService.isLoading = true;
  return apiService.getPerson(route.params['id']).pipe(
    tap(person =>peopleDetailService.activePerson = person),
    finalize(() => { loadingStateService.isLoading = false; }),
    catchError(err => {
      router.navigate(['/error-404']); 
      return throwError(() => err);
    }),
  );
};
