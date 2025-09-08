import { Routes } from '@angular/router';
import { PeopleList } from './components/people/people-list/people-list';
import { PeopleDetail } from './components/people/people-detail/people-detail';
import { peopleResolver } from './resolver/people-resolver';
import { personResolver } from './resolver/person-resolver';
import { Overview } from './components/overview/overview';

export const routes: Routes = [
    {
        path: '',
        component: Overview
    },
    {
        path: 'people',
        component: PeopleList,
        resolve: { people: peopleResolver },
    },
    {
        path: 'person/:id',
        component: PeopleDetail,
        resolve: { person: personResolver },
    },
        {
        path: 'error-404',
        loadComponent: () => import('./components/error-page/error-page').then(m => m.ErrorPage)
    },
    {
        path: '**',
        loadComponent: () => import('./components/error-page/error-page').then(m => m.ErrorPage)
    }
];
