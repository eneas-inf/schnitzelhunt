import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
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
  IonIcon 
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, compass, trophy, settings } from 'ionicons/icons';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
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
    IonIcon
  ],
})
export class LeaderboardPage {
  constructor() {
    addIcons({ home, compass, trophy, settings });
  }
}
