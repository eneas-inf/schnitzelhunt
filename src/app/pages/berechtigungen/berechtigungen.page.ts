import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { camera, location } from 'ionicons/icons';

@Component({
  selector: 'app-berechtigungen',
  templateUrl: './berechtigungen.page.html',
  styleUrls: ['./berechtigungen.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class BerechtigungenPage {
  constructor() {
    addIcons({ camera, location });
  }
}
