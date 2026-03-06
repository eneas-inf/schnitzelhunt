import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonIcon, IonItem, IonLabel, IonList, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, location } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-berechtigungen',
  templateUrl: './berechtigungen.page.html',
  styleUrls: ['./berechtigungen.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonText, IonList, IonCardTitle, IonLabel, IonButton, IonLabel, IonCardContent, IonCardHeader, IonCard, IonItem, IonItem, IonIcon, IonIcon, RouterLink],
})
export class BerechtigungenPage {
  constructor() {
    addIcons({ camera, location });
  }
}
