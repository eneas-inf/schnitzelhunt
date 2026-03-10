import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonList, 
  IonListHeader,
  IonItem, 
  IonLabel, 
  IonButton, 
  IonIcon, 
  IonToggle,
  IonFooter, 
  IonTabBar, 
  IonTabButton 
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, compass, trophy, settings } from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonList, 
    IonListHeader,
    IonItem, 
    IonLabel, 
    IonButton, 
    IonIcon, 
    IonToggle,
    IonFooter, 
    IonTabBar, 
    IonTabButton
  ]
})
export class SettingsPage {
  constructor() {
    addIcons({ home, compass, trophy, settings });
  }
}
