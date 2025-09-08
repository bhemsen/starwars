import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoadingStateService } from './shared/services/loading/loading-state-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressSpinner, MatToolbar, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly loadingService: LoadingStateService = inject(LoadingStateService)
  private readonly router = inject(Router);

  protected readonly title = signal('starwars');

  get isLoading() {
    return this.loadingService.isLoading;
  }

  get isBaseRoute() {
    return this.router.url === '/'
  }

}
