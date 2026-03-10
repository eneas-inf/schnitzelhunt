import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonSearchbar,
  IonChip,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonFooter,
  IonTabBar,
  IonTabButton,
  IonLabel
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, compass, trophy, settings } from 'ionicons/icons';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonSearchbar,
    IonChip,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonLabel
  ]
})
export class ExplorePage {
  hunts = [
    { title: 'City Explorer Hunt', description: "Explore the city's hidden gems.", difficulty: 'Easy', type: 'easy' },
    { title: 'Nature Trail Adventure', description: 'Discover the beauty of nature.', difficulty: 'Medium', type: 'medium' },
    { title: 'Historical Quest', description: 'Uncover secrets from the past.', difficulty: 'Hard', type: 'hard' }
  ];

  constructor() {
    addIcons({ home, compass, trophy, settings });
  }
}
