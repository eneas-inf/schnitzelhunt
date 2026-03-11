import { Component, inject, OnDestroy } from '@angular/core';
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
import { RouterModule, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { restaurant, egg, time, trophy } from 'ionicons/icons';
import { SchnitzelhuntService } from '../../services/schnitzelhunt.service';
import { firstValueFrom } from 'rxjs';

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
export class ResultsPage implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly huntService = inject(SchnitzelhuntService);
  status: 'success' | 'failed' = 'success';
  schnitzels = 0;
  potatoes = 0;
  durationMs = 0;
  points = 0;
  displaySchnitzels = 0;
  displayPotatoes = 0;
  displayDurationMs = 0;
  displayPoints = 0;

  private animationFrameId: number | null = null;
  private animationStartedAt = 0;
  private readonly animationDurationMs = 1200;

  constructor() {
    addIcons({ restaurant, egg, time, trophy });

    this.route.queryParams.subscribe(async params => {
      this.status = params['status'] || 'success';
      await this.loadStatsFromStorage(params);
      this.startCountUpAnimation();
    });
  }

  get formattedDuration(): string {
    const totalSeconds = Math.max(0, Math.floor(this.displayDurationMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  ngOnDestroy(): void {
    this.stopAnimation();
  }

  private parseNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private async loadStatsFromStorage(params: Record<string, unknown>): Promise<void> {
    if (this.status === 'success') {
      try {
        const completed = await firstValueFrom(this.huntService.getLatestCompletedHunt());
        this.schnitzels = completed.schnitzels;
        this.potatoes = completed.potatoes;
        this.durationMs = completed.durationMs;
        this.points = Math.max(0, completed.points);
        return;
      } catch {
        // Fall through to reset values.
      }
    }

    if (this.status === 'failed') {
      const huntId = this.parseNumber(params['huntId']);
      if (huntId > 0) {
        try {
          const active = await firstValueFrom(this.huntService.getActiveHunt(huntId));
          this.schnitzels = active.schnitzels;
          this.potatoes = active.potatoes;
          this.durationMs = Date.now() - active.startTime.getTime();
          this.points = Math.max(0, (this.schnitzels * 10) - (this.potatoes * 5));
          this.huntService.clearPersistedActiveHuntProgress(active.id);
          return;
        } catch {
          // Fall through to reset values.
        }
      }
    }

    this.schnitzels = 0;
    this.potatoes = 0;
    this.durationMs = 0;
    this.points = 0;
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  private startCountUpAnimation(): void {
    this.stopAnimation();
    this.displaySchnitzels = 0;
    this.displayPotatoes = 0;
    this.displayDurationMs = 0;
    this.displayPoints = 0;
    this.animationStartedAt = performance.now();
    this.animationFrameId = requestAnimationFrame((time) => this.animate(time));
  }

  private animate(now: number): void {
    const elapsed = now - this.animationStartedAt;
    const progress = Math.min(elapsed / this.animationDurationMs, 1);

    this.displaySchnitzels = Math.floor(this.schnitzels * progress);
    this.displayPotatoes = Math.floor(this.potatoes * progress);
    this.displayDurationMs = Math.floor(this.durationMs * progress);
    this.displayPoints = Math.round(this.points * progress);

    if (progress < 1) {
      this.animationFrameId = requestAnimationFrame((time) => this.animate(time));
    } else {
      this.animationFrameId = null;
    }
  }

  private stopAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
