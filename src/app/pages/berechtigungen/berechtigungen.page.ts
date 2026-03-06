import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonIcon, IonItem, IonLabel, IonList, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-berechtigungen',
  templateUrl: './berechtigungen.page.html',
  styleUrls: ['./berechtigungen.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonText, IonList, IonCardTitle, IonLabel, IonButton, IonLabel, IonCardContent, IonCardHeader, IonCard, IonItem, IonItem, IonIcon, IonIcon],
})
export class BerechtigungenPage {
}
