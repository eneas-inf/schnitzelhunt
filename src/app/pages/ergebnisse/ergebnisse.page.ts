import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
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
  IonButton 
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { restaurant, egg, time } from 'ionicons/icons';

@Component({
  selector: 'app-ergebnisse',
  templateUrl: './ergebnisse.page.html',
  styleUrls: ['./ergebnisse.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
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
    IonButton
  ],
})
export class ErgebnissePage {
  constructor() {
    addIcons({ restaurant, egg, time });
  }
}
