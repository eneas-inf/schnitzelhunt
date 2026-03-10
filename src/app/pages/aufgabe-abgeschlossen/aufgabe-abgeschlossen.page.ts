import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonIcon, 
  IonProgressBar, 
  IonButton
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';

@Component({
  selector: 'app-aufgabe-abgeschlossen',
  templateUrl: './aufgabe-abgeschlossen.page.html',
  styleUrls: ['./aufgabe-abgeschlossen.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonIcon, 
    IonProgressBar, 
    IonButton
  ],
})
export class AufgabeAbgeschlossenPage {
  constructor() {
    addIcons({ checkmarkCircle });
  }
}
