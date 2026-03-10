import { Component } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonList, IonSearchbar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
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
}
