import { Component } from '@angular/core';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonTitle, IonToggle, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonToggle,
  ],
})
export class SettingsPage {}
