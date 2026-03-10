import { Component } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonFooter, IonHeader, IonIcon, IonLabel, IonList, IonSearchbar, IonTabBar, IonTabButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { compass, home, settings, trophy } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
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
    IonLabel,
  ],
})
export class ExplorePage {
  hunts = [
    { title: 'City Explorer Hunt', description: 'Explore the city\'s hidden gems.', difficulty: 'Easy', type: 'easy' },
    {
      title: 'Nature Trail Adventure',
      description: 'Discover the beauty of nature.',
      difficulty: 'Medium',
      type: 'medium',
    },
    { title: 'Historical Quest', description: 'Uncover secrets from the past.', difficulty: 'Hard', type: 'hard' },
  ];

  constructor() {
    addIcons({ home, compass, trophy, settings });
  }
}
