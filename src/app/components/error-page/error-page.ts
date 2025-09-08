import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error-page',
  imports: [MatButton, RouterModule],
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss'
})
export class ErrorPage {

}
