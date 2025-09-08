import { Component, input } from '@angular/core';
import { AlertType } from '../../types/alert.type';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.scss'
})
export class Alert {
  readonly alertText = input.required<string>();
  readonly alertType = input.required<AlertType>();
}
