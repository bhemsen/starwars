import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from '../../types/person';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly httpClient: HttpClient = inject(HttpClient)
  private readonly basUrl = "https://swapi.info/api"

  getPeople():Observable<Person[]> {
    return this.httpClient.get<Person[]>(`${this.basUrl}/people`)
  }

  getPerson(id: number | string): Observable<Person>  {
    const personId = id.toString()
    return this.httpClient.get<Person>(`${this.basUrl}/people/${personId}`)
  }
}
