import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { compass, home, trophy } from 'ionicons/icons';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  private readonly router = inject(Router);

  protected showTabs = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => !/\/hunt\/\d+\/tasks/.test(this.router.url)),
      startWith(!/\/hunt\/\d+\/tasks/.test(this.router.url))
    ),
    { initialValue: true }
  );

  constructor() {
    addIcons({ home, compass, trophy });
  }
}
