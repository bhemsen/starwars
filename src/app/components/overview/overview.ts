import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Category } from '../../shared/types/category';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-overview',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardFooter,
    MatButton,
    RouterModule
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Overview {
  categories: Category[] = [
    {
      name: 'Personen', 
      content: 'Eine Liste aller Personen des Star Wars Universums',
      linkRealtiveUrl: '/people',
      linkText: 'zu den Personen'
    },    
    {
      name: 'Raumschiffe', 
      content: 'Eine Liste aller Raumschiffe des Star Wars Universums',
      linkRealtiveUrl: '/starships',
      linkText: 'zu den Raumschiffen',
      isDisabled: true
    },    
    {
      name: 'Planeten', 
      content: 'Eine Liste aller Planeten des Star Wars Universums',
      linkRealtiveUrl: '/planets',
      linkText: 'zu den Planeten',
      isDisabled: true
    },    
    {
      name: 'Spezies', 
      content: 'Eine Liste aller Spezies des Star Wars Universums',
      linkRealtiveUrl: '/species',
      linkText: 'zu den Spezies',
      isDisabled: true
    },    
    {
      name: 'Filme', 
      content: 'Eine Liste aller Filme des Star Wars Universums',
      linkRealtiveUrl: '/films',
      linkText: 'zu den Filmen',
      isDisabled: true
    },    
    {
      name: 'Fahrzeuge', 
      content: 'Eine Liste aller Fahrzeuge des Star Wars Universums',
      linkRealtiveUrl: '/vehicles',
      linkText: 'zu den Fahrzeugen',
      isDisabled: true
    }
  ]
}
