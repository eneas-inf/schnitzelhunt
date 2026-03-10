import { Injectable } from '@angular/core';
import { App, AppState } from '@capacitor/app';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private appState = new Subject<AppState>();

  constructor() {
    App.addListener('appStateChange', (state) => {
      this.appState.next(state);
    });
  }

  public onStateChange(): Observable<AppState> {
    return this.appState.asObservable();
  }
}
