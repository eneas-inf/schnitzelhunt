import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonText } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aufgabe-anzeigen',
  templateUrl: './aufgabe-anzeigen.page.html',
  styleUrls: ['./aufgabe-anzeigen.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonText, IonButton, IonCardHeader, IonText, IonCardTitle, IonCardContent, IonButton, IonCard, RouterLink],
})
export class AufgabeAnzeigenPage {
}
