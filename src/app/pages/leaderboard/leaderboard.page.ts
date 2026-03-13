import { Component, inject, OnInit } from '@angular/core';
import { IonBadge, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonSkeletonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trophy } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { LeaderboardEntry, LeaderboardService } from '../../services/leaderboard.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonIcon,
    IonSkeletonText,
  ],
})
export class LeaderboardPage implements OnInit {
  private readonly leaderboardService = inject(LeaderboardService);
  private readonly userService = inject(UserService);

  protected entries: LeaderboardEntry[] = [];
  protected currentUsername = '';
  protected isLoading = true;

  constructor() {
    addIcons({ trophy });
  }

  async ngOnInit(): Promise<void> {
    await this.loadLeaderboard();
  }

  protected getBadgeColor(index: number): string {
    if (index === 0) {
      return 'warning';
    }
    if (index === 1) {
      return 'medium';
    }
    if (index === 2) {
      return 'tertiary';
    }
    return 'primary';
  }

  protected isCurrentUser(entry: LeaderboardEntry): boolean {
    if (!this.currentUsername) {
      return false;
    }
    return entry.name.trim().toLowerCase() === this.currentUsername;
  }

  private async loadLeaderboard(): Promise<void> {
    this.currentUsername = (await this.userService.getUsername()).trim().toLowerCase();
    this.entries = await firstValueFrom(this.leaderboardService.getLeaderboard());
    this.isLoading = false;
  }
}
