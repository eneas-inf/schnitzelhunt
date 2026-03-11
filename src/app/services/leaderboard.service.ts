import { Injectable, inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { SchnitzelhuntService } from './schnitzelhunt.service';
import { UserService } from './user.service';

const LEADERBOARD_DUMMY_STORAGE_KEY = 'leaderboard_dummy_profiles';

export interface LeaderboardEntry {
  name: string;
  points: number;
  hunts: number;
}

interface DummyProfile {
  name: string;
  schnitzels: number;
  potatoes: number;
  hunts: number;
}

const DEFAULT_DUMMIES: DummyProfile[] = [
  { name: 'User A', schnitzels: 6, potatoes: 4, hunts: 8 }, // 40
  { name: 'User B', schnitzels: 5, potatoes: 3, hunts: 7 }, // 35
  { name: 'User C', schnitzels: 4, potatoes: 2, hunts: 6 }, // 30
  { name: 'User D', schnitzels: 4, potatoes: 3, hunts: 6 }, // 25
  { name: 'User E', schnitzels: 3, potatoes: 2, hunts: 5 }, // 20
  { name: 'User F', schnitzels: 2, potatoes: 1, hunts: 4 }, // 15
  { name: 'User G', schnitzels: 2, potatoes: 2, hunts: 3 }, // 10
  { name: 'User H', schnitzels: 1, potatoes: 1, hunts: 2 }, // 5
  { name: 'User I', schnitzels: 3, potatoes: 5, hunts: 2 }, // 5
];

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly huntService = inject(SchnitzelhuntService);
  private readonly userService = inject(UserService);

  getLeaderboard(): Observable<LeaderboardEntry[]> {
    return from(this.buildLeaderboard());
  }

  private async buildLeaderboard(): Promise<LeaderboardEntry[]> {
    const dummyProfiles = await this.getDummyProfiles();
    const dummyEntries = dummyProfiles.map((profile) => ({
      name: profile.name,
      hunts: profile.hunts,
      points: this.calculatePoints(profile.schnitzels, profile.potatoes),
    }));

    await this.userService.ensureLoaded();
    const username = this.userService.getUsername().trim() || 'unknown';
    const completedHunts = await firstValueFrom(this.huntService.getCompletedHunts());
    const userSchnitzels = completedHunts.reduce((sum, hunt) => sum + hunt.schnitzels, 0);
    const userPotatoes = completedHunts.reduce((sum, hunt) => sum + hunt.potatoes, 0);
    const userEntry: LeaderboardEntry = {
      name: username,
      hunts: completedHunts.length,
      points: this.calculatePoints(userSchnitzels, userPotatoes),
    };
    const withoutDuplicateDummy = dummyEntries.filter(
      (entry) => entry.name.toLowerCase() !== username.toLowerCase(),
    );

    return [...withoutDuplicateDummy, userEntry].sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      if (b.hunts !== a.hunts) {
        return b.hunts - a.hunts;
      }
      return a.name.localeCompare(b.name);
    });
  }

  private async getDummyProfiles(): Promise<DummyProfile[]> {
    const { value } = await Preferences.get({ key: LEADERBOARD_DUMMY_STORAGE_KEY });
    if (!value) {
      await Preferences.set({
        key: LEADERBOARD_DUMMY_STORAGE_KEY,
        value: JSON.stringify(DEFAULT_DUMMIES),
      });
      return DEFAULT_DUMMIES;
    }
    try {
      const parsed = JSON.parse(value) as DummyProfile[];
      if (Array.isArray(parsed) && parsed.length === 9) {
        return parsed;
      }
    } catch {
    }

    await Preferences.set({
      key: LEADERBOARD_DUMMY_STORAGE_KEY,
      value: JSON.stringify(DEFAULT_DUMMIES),
    });
    return DEFAULT_DUMMIES;
  }

  private calculatePoints(schnitzels: number, potatoes: number): number {
    return Math.max(0, (schnitzels * 10) - (potatoes * 5));
  }
}
