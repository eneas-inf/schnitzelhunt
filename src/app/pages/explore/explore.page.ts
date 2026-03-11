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

  protected hunts: SchnitzelhuntInfo[] = [];
  protected visibleHunts: SchnitzelhuntInfo[] = [];
  protected searchTerm = '';
  protected sortKey: 'category' | 'difficulty' | 'location' = 'category';

  constructor() {
    addIcons({ compass });
  }

  ngOnInit(): void {
    this.huntService.getSchnitzelhunts()
      .subscribe(hunts => {
        this.hunts = hunts;
        this.applyFiltersAndSorting();
      });
  }

  async startHunt(hunt: SchnitzelhuntInfo) {
    const active = this.huntService.initSchnitzelhunt(hunt);
    await this.router.navigate(['hunt', active.id, 'tasks']);
  }

  onSearchInput(event: Event): void {
    const target = event.target as { value?: string | null } | null;
    this.searchTerm = (target?.value ?? '').toString();
    this.applyFiltersAndSorting();
  }

  setSortKey(sortKey: 'category' | 'difficulty' | 'location'): void {
    this.sortKey = sortKey;
    this.applyFiltersAndSorting();
  }

  private applyFiltersAndSorting(): void {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();
    let filtered = this.hunts.filter((hunt) => {
      if (!normalizedSearch) {
        return true;
      }
      return [
        hunt.name,
        hunt.description,
        hunt.category,
        hunt.location,
        hunt.difficulty,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);
    });

    if (this.sortKey === 'difficulty') {
      filtered = filtered.filter((hunt) => hunt.difficulty === 'Easy');
    }

    this.visibleHunts = filtered.sort((a, b) => {
      if (this.sortKey === 'difficulty') {
        return this.getDifficultyRank(a.difficulty) - this.getDifficultyRank(b.difficulty);
      }
      return a[this.sortKey].localeCompare(b[this.sortKey]);
    });
  }

  private getDifficultyRank(difficulty: SchnitzelhuntInfo['difficulty']): number {
    switch (difficulty) {
      case 'Easy':
        return 0;
      case 'Medium':
        return 1;
      case 'Hard':
        return 2;
    }
  }
}
