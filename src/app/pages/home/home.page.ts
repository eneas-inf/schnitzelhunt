import { Component } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import {addIcons} from "ionicons";
import { homeOutline } from "ionicons/icons";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
  ],
})
export class HomePage {
  recentActivities = [
    { name: 'Schnitzel Hunt: Migros Adventure', completed: 'Yesterday', score: 1200 },
    { name: 'Schnitzel Hunt: Subway Adventure', completed: '3 days ago', score: 1800 },
    { name: 'Schnitzel Hunt: City Explorer', completed: '2 hours ago', score: 1500 },
  ];

  constructor() {
    addIcons({ homeOutline });
  }
}
