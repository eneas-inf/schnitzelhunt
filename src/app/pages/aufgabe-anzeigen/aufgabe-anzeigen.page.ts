import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { navigateCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-aufgabe-anzeigen',
  templateUrl: './aufgabe-anzeigen.page.html',
  styleUrls: ['./aufgabe-anzeigen.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class AufgabeAnzeigenPage {
  constructor() {
    addIcons({ navigateCircleOutline });
  }
}
