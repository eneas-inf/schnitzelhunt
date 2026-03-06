import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonItem, IonLabel, IonList, IonText } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ergebnisse',
  templateUrl: './ergebnisse.page.html',
  styleUrls: ['./ergebnisse.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonCard, IonCardTitle, IonList, IonItem, IonLabel, IonLabel, IonItem, IonText, IonLabel, IonCardContent, IonCardHeader, IonItem, RouterLink],
})
export class ErgebnissePage {
}
