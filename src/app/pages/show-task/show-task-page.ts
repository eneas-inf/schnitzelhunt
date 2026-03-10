import { Component } from '@angular/core';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonProgressBar, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { navigateCircleOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-show-task',
  templateUrl: './show-task-page.html',
  styleUrls: ['./show-task-page.scss'],
  standalone: true,
  imports: [
    RouterLink,
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
    IonButton,
  ],
})
export class ShowTaskPage {
  constructor() {
    addIcons({ navigateCircleOutline });
  }
}
