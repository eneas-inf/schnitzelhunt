import { Component } from '@angular/core';
import { IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonTabBar, IonTabButton, IonTitle, IonToggle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { compass, home, settings, trophy } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonIcon,
    IonToggle,
    IonFooter,
    IonTabBar,
    IonTabButton,
  ],
})
export class SettingsPage {
  constructor() {
    addIcons({ home, compass, trophy, settings });
  }
}
