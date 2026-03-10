import { Component } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonIcon, IonProgressBar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aufgabe-abgeschlossen',
  templateUrl: './aufgabe-abgeschlossen.page.html',
  styleUrls: ['./aufgabe-abgeschlossen.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonProgressBar,
    IonButton,
  ],
})
export class AufgabeAbgeschlossenPage {
  constructor() {
    addIcons({ checkmarkCircle });
  }
}
