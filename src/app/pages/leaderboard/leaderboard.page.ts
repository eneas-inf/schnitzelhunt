import { Component } from '@angular/core';
import { IonBadge, IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTabBar, IonTabButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { compass, home, settings, trophy } from 'ionicons/icons';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonIcon,
  ],
})
export class LeaderboardPage {
  constructor() {
    addIcons({ home, compass, trophy, settings });
  }
}
