import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingStateService {
  private _isLoading = signal<boolean>(false);

  set isLoading(val: boolean) {
    this._isLoading.set(val);
  }

  get isLoading() {
    return this._isLoading();
  }
}
