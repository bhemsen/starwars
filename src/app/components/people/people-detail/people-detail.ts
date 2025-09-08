import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PeopleDetailService } from './people-detail-service';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-people-detail',
  imports: [
    MatIconButton,
    MatIcon,
    MatCard, 
    MatCardHeader,
    MatCardTitle, 
    MatCardSubtitle, 
    MatCardContent, 
    MatColumnDef,
    MatHeaderCell, 
    MatHeaderRow,
    MatHeaderCellDef,
    MatCell,
    MatCellDef, 
    MatRow,
    MatHeaderRowDef, 
    MatRowDef,
    MatTable
  ],
  templateUrl: './people-detail.html',
  styleUrl: './people-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleDetail {
  private readonly peopleDetailService = inject(PeopleDetailService)
  protected readonly displayedColumns: string[] = ['label', 'value'];
  protected readonly rows = this.peopleDetailService.personDisplayRows
  protected readonly activePerson = this.peopleDetailService.activePersonSignal;

  clear() {
    this.peopleDetailService.activePerson = undefined;
  }
}

