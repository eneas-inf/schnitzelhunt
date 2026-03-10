import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { compass, home, settings, trophy } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  standalone: true,
  imports: [IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterLink],
})
export class TabsPage {
  constructor() {
    addIcons({ home, compass, trophy, settings });
  }
}

