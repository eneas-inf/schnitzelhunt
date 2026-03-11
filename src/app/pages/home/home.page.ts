import { Component, inject, OnInit } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline } from 'ionicons/icons';
import {Router, RouterLink} from "@angular/router";
import { SchnitzelhuntService } from '../../services/schnitzelhunt.service';
import { firstValueFrom } from 'rxjs';
import { SchnitzelhuntInfo } from '../../models/schnitzelhunt';

interface RecentActivity {
  hunt: SchnitzelhuntInfo;
  name: string;
  completed: string;
  score: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    RouterLink,
  ],
})
export class HomePage implements OnInit {
  private readonly huntService = inject(SchnitzelhuntService);
  private readonly router = inject(Router);

  recentActivities: RecentActivity[] = [];

  constructor() {
    addIcons({ homeOutline });
  }

  async ngOnInit(): Promise<void> {
    try {
      const completedHunts = await firstValueFrom(this.huntService.getCompletedHunts());
      this.recentActivities = completedHunts
        .sort((a, b) => b.completionDate.getTime() - a.completionDate.getTime())
        .slice(0, 6)
        .map((hunt) => ({
          hunt: hunt.info,
          name: hunt.info.name,
          completed: this.formatRelativeTime(hunt.completionDate),
          score: hunt.points,
        }));
    } catch {
      this.recentActivities = [];
    }
  }

  private formatRelativeTime(date: Date): string {
    const elapsedMs = Date.now() - date.getTime();
    const elapsedMinutes = Math.floor(elapsedMs / 60000);
    if (elapsedMinutes < 1) {
      return 'just now';
    }
    if (elapsedMinutes < 60) {
      return `${elapsedMinutes} minute${elapsedMinutes === 1 ? '' : 's'} ago`;
    }
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 24) {
      return `${elapsedHours} hour${elapsedHours === 1 ? '' : 's'} ago`;
    }
    const elapsedDays = Math.floor(elapsedHours / 24);
    if (elapsedDays < 7) {
      return `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`;
    }
    return date.toLocaleDateString();
  }

  async huntAgain(activity: RecentActivity): Promise<void> {
    const active = this.huntService.initSchnitzelhunt(activity.hunt);
    await this.router.navigate(['hunt', active.id, 'tasks']);
  }
}
