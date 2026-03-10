import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButton, 
  IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { camera, location, shieldCheckmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-berechtigungen',
  templateUrl: './berechtigungen.page.html',
  styleUrls: ['./berechtigungen.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon
],
})
export class BerechtigungenPage {
  currentStep = 1; // 1: Camera, 2: Location

  constructor(private router: Router) {
    addIcons({ camera, location, shieldCheckmarkOutline });
  }

  nextStep() {
    if (this.currentStep === 1) {
      this.currentStep = 2;
    } else {
      this.router.navigate(['/home']);
    }
  }

  requestCamera() {
    // Logic to request camera permission would go here
    console.log('Requesting Camera Permission');
    this.nextStep();
  }

  requestLocation() {
    // Logic to request location permission would go here
    console.log('Requesting Location Permission');
    this.router.navigate(['/home']);
  }
}
