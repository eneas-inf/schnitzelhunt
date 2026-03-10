import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButton, 
  IonIcon,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { restaurant, egg, time } from 'ionicons/icons';

@Component({
  selector: 'app-results',
  templateUrl: './results-page.html',
  styleUrls: ['./results-page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class ResultsPage {
  status: 'success' | 'failed' = 'success';

  constructor(private route: ActivatedRoute) {
    addIcons({ restaurant, egg, time });
    
    this.route.queryParams.subscribe(params => {
      this.status = params['status'] || 'success';
    });
  }
}
