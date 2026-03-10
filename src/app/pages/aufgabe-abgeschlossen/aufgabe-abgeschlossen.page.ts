import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';

@Component({
  selector: 'app-aufgabe-abgeschlossen',
  templateUrl: './aufgabe-abgeschlossen.page.html',
  styleUrls: ['./aufgabe-abgeschlossen.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class AufgabeAbgeschlossenPage {
  constructor() {
    addIcons({ checkmarkCircle });
  }
}
