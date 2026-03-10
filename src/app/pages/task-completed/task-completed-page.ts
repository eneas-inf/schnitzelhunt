import {Component} from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonProgressBar,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {checkmarkCircle} from 'ionicons/icons';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-task-completed',
  templateUrl: './task-completed-page.html',
  styleUrls: ['./task-completed-page.scss'],
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
export class TaskCompletedPage {
  constructor() {
    addIcons({checkmarkCircle});
  }
}
