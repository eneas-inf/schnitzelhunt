import { Component, inject, OnInit } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonList, IonSearchbar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { compass } from 'ionicons/icons';
import { SchnitzelhuntInfo } from '../../models/schnitzelhunt';
import { SchnitzelhuntService } from '../../services/schnitzelhunt.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: true,
  imports: [
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
  ],
})
export class ExplorePage implements OnInit {
  private readonly huntService = inject(SchnitzelhuntService);
  private readonly router = inject(Router);

  protected hunts!: SchnitzelhuntInfo[];

  constructor() {
    addIcons({ compass });
  }

  ngOnInit(): void {
    this.huntService.getSchnitzelhunts()
      .subscribe(hunts => this.hunts = hunts);
  }

  async startHunt(hunt: SchnitzelhuntInfo) {
    const active = this.huntService.initSchnitzelhunt(hunt);
    await this.router.navigate(['hunt', active.id, 'tasks']);
  }
}
