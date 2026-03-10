import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons,
  IonBackButton,
  IonItem,
  IonIcon,
  IonLabel,
  IonProgressBar,
  IonText,
  IonButton
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { navigateCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-aufgabe-anzeigen',
  templateUrl: './aufgabe-anzeigen.page.html',
  styleUrls: ['./aufgabe-anzeigen.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons,
    IonBackButton,
    IonItem,
    IonIcon,
    IonLabel,
    IonProgressBar,
    IonText,
    IonButton
  ],
})
export class AufgabeAnzeigenPage {
  constructor() {
    addIcons({ navigateCircleOutline });
  }
}
