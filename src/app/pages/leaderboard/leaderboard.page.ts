import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBadge, IonButton, IonCard, IonCardContent, IonContent, IonItem, IonLabel, IonList, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonText, IonCard, IonCardContent, IonBadge, IonList, IonItem, IonItem, IonItem, IonBadge, IonLabel, IonBadge, IonLabel, IonBadge, IonItem, IonBadge, IonItem, IonButton, IonLabel, IonLabel, IonLabel],
})
export class LeaderboardPage  {
}
