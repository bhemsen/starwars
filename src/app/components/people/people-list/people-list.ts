import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PeopleListService } from './people-list-service';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { PeopleDetail } from '../people-detail/people-detail';
import { MatIcon } from '@angular/material/icon';
import { PeopleDetailService } from '../people-detail/people-detail-service';
import { RouterModule } from '@angular/router';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Person } from '../../../shared/types/person';
import { MatDialog } from '@angular/material/dialog';
import { AddPersonDialog } from '../add-person-dialog/add-person-dialog';
import { SplitView } from "../../../shared/ui-components/split-view/split-view";
import { Alert } from "../../../shared/ui-components/alert/alert";

@Component({
  selector: 'app-people-list',
  imports: [
    MatButton,
    MatList,
    MatListItem,
    MatDivider,
    PeopleDetail,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    MatSuffix,
    MatIconButton,
    RouterModule,
    ReactiveFormsModule,
    SplitView,
    Alert
],
  templateUrl: './people-list.html',
  styleUrl: './people-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleList {
  private readonly peopleListService = inject(PeopleListService)
  private readonly peopleDetailService = inject(PeopleDetailService)
  readonly dialog = inject(MatDialog);

  protected readonly searchCtrl = new FormControl<string>('');
  
  readonly people = this.peopleListService.peopleSignal
  
  protected personAdded = false;

  protected readonly showAlert = signal(false);
  protected readonly searchResults = signal<Person[]>([]);
  protected readonly isSearching = signal(false);
  protected readonly hasActivePerson = computed<boolean>(() => {
        const p = !!this.peopleDetailService.activePersonSignal();
        return p;
      });


  protected alertText = '';

  constructor() {
    this.searchCtrl.valueChanges.pipe(
      map(v => (v ?? '').trim()),
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe({
      next: term => {
        if(!term || term.length === 0){
          this.isSearching.set(false) ;
          return
        }
        this.isSearching.set(true)
        const res = this.people().filter(person => {
          const name = person.name.toLowerCase();
          const searchTerm = term.toLowerCase();
          return name.includes(searchTerm);
        })
        this.searchResults.set(res) 
      }
    });
  }

  setActivePerson(person: Person) {
    this.peopleDetailService.activePerson = person;
  }

  getPersonId(person: Person) {
    this.peopleListService.getPersonId(person);
  }

  clear() {
    this.searchCtrl.setValue('');
  }

  removePerson(name: string) {
    this.peopleListService.removePerson(name);
  }

  openAddPersonDialog() {
    this.dialog.open(AddPersonDialog).afterClosed().subscribe(person => {
      if (!person) return;
      this.personAdded = this.peopleListService.addPerson(person);
      if(!this.personAdded) this.alertText = 'Schon in der Liste, die Person ist'
      else this.alertText = 'Eine neue Person hinzugefügt, du hast!'
      this.showAlert.set(true);
      setTimeout(()=> {
        this.showAlert.set(false)
      },5000)
    });
  }
}
