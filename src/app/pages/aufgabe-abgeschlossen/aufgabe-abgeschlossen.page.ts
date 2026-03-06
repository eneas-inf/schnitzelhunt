import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonContent, IonIcon, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-aufgabe-abgeschlossen',
  templateUrl: './aufgabe-abgeschlossen.page.html',
  styleUrls: ['./aufgabe-abgeschlossen.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonCardContent, IonCard, IonButton, IonText, IonText, IonIcon],
})
export class AufgabeAbgeschlossenPage {
}
