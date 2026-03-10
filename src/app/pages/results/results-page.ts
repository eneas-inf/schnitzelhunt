import { Component } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { egg, restaurant, time } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results-page.html',
  styleUrls: ['./results-page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton,
  ],
})
export class ResultsPage {
  constructor() {
    addIcons({ restaurant, egg, time });
  }
}
