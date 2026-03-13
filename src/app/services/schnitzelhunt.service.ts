import {inject, Injectable} from '@angular/core';
import { ActiveSchnitzelhunt, CompletedSchnitzelhunt, SchnitzelhuntInfo } from '../models/schnitzelhunt';
import { from, Observable, of, switchMap, throwError } from 'rxjs';
import { FlipTask, LocationTask, PowerTask, QrTask, TravelTask, WifiTask } from '../models/task';
import { Preferences } from '@capacitor/preferences';
import {LeaderboardService} from "./leaderboard.service";

const ACTIVE_HUNT_STORAGE_KEY = 'active_hunt_progress';
const COMPLETED_HUNTS_STORAGE_KEY = 'completed_hunts';

interface PersistedActiveHuntProgress {
  activeHuntId: number;
  infoId: number;
  currentTask: number;
  startTimeIso: string;
  schnitzels: number;
  potatoes: number;
}

interface PersistedCompletedHunt {
  id: number;
  infoId: number;
  schnitzels: number;
  potatoes: number;
  completionDateIso: string;
  durationMs: number;
  points: number;
}

@Injectable({
  providedIn: 'root',
})
export class SchnitzelhuntService {
  private readonly leaderboardService=inject(LeaderboardService);
  private activeHuntsId = 1;
  private completedHuntsId = 1;
  private activeHunts: Map<number, ActiveSchnitzelhunt> = new Map();
  private completedHunts: Map<number, CompletedSchnitzelhunt> = new Map();
  private readonly restorePromise: Promise<void>;

  constructor() {
    this.restorePromise = this.restoreStoredProgress();
  }

  public getSchnitzelhunts(): Observable<SchnitzelhuntInfo[]> {
    return of(SCHNITZELHUNTS);
  }

  public getSchnitzelhunt(id: number): Observable<SchnitzelhuntInfo> {
    return this.throwIfNotFound(SCHNITZELHUNTS.find(hunt => hunt.id === id), 'Schnitzelhunt not found!');
  }

  public initSchnitzelhunt(hunt: SchnitzelhuntInfo): ActiveSchnitzelhunt {
    const newHunt: ActiveSchnitzelhunt = {
      id: this.activeHuntsId++,
      info: hunt,
      startTime: new Date(),
      schnitzels: 0,
      potatoes: 0,
      currentTask: 0,
    };
    this.activeHunts.set(newHunt.id, newHunt);
    void this.saveActiveHuntProgress(newHunt);
    return newHunt;
  }

  public getActiveHunt(id: number): Observable<ActiveSchnitzelhunt> {
    return from(this.restorePromise).pipe(
      switchMap(() => this.throwIfNotFound(this.activeHunts.get(id), 'Active schnitzelhunt not found!')),
    );
  }

  public completeSchnitzelhunt(activeHunt: ActiveSchnitzelhunt): CompletedSchnitzelhunt {
    const completed: CompletedSchnitzelhunt = {
      id: this.completedHuntsId++,
      info: activeHunt.info,
      schnitzels: activeHunt.schnitzels,
      potatoes: activeHunt.potatoes,
      completionDate: new Date(),
      durationMs: new Date().getTime() - activeHunt.startTime.getTime(),
      points: this.leaderboardService.calculatePoints(activeHunt.schnitzels, activeHunt.potatoes),
    };
    this.activeHunts.delete(activeHunt.id);
    this.completedHunts.set(completed.id, completed);
    void this.clearActiveHuntProgress(activeHunt.id);
    void this.saveCompletedHunts();
    return completed;
  }

  public getCompletedHunts(): Observable<CompletedSchnitzelhunt[]> {
    return from(this.restorePromise).pipe(
      switchMap(() => of(Array.from(this.completedHunts.values()))),
    );
  }

  public getCompletedHunt(id: number): Observable<CompletedSchnitzelhunt> {
    return from(this.restorePromise).pipe(
      switchMap(() => this.throwIfNotFound(this.completedHunts.get(id), 'Completed schnitzelhunt not found!')),
    );
  }

  public getLatestCompletedHunt(): Observable<CompletedSchnitzelhunt> {
    return from(this.restorePromise).pipe(
      switchMap(() => {
        const latest = Array.from(this.completedHunts.values())
          .sort((a, b) => b.id - a.id)[0];
        return this.throwIfNotFound(latest, 'No completed schnitzelhunt found!');
      }),
    );
  }

  public persistActiveHuntProgress(activeHunt: ActiveSchnitzelhunt): void {
    void this.saveActiveHuntProgress(activeHunt);
  }

  public clearPersistedActiveHuntProgress(activeHuntId: number): void {
    void this.clearActiveHuntProgress(activeHuntId);
  }

  private throwIfNotFound<T>(item: T | null | undefined, msg: string): Observable<T> {
    return item ? of(item) : throwError(() => new Error(msg));
  }

  private async saveActiveHuntProgress(activeHunt: ActiveSchnitzelhunt): Promise<void> {
    const payload: PersistedActiveHuntProgress = {
      activeHuntId: activeHunt.id,
      infoId: activeHunt.info.id,
      currentTask: activeHunt.currentTask,
      startTimeIso: activeHunt.startTime.toISOString(),
      schnitzels: activeHunt.schnitzels,
      potatoes: activeHunt.potatoes,
    };
    await Preferences.set({
      key: ACTIVE_HUNT_STORAGE_KEY,
      value: JSON.stringify(payload),
    });
  }

  private async clearActiveHuntProgress(activeHuntId: number): Promise<void> {
    const { value } = await Preferences.get({ key: ACTIVE_HUNT_STORAGE_KEY });
    if (!value) {
      return;
    }
    try {
      const parsed = JSON.parse(value) as PersistedActiveHuntProgress;
      if (parsed.activeHuntId === activeHuntId) {
        await Preferences.remove({ key: ACTIVE_HUNT_STORAGE_KEY });
      }
    } catch {
      await Preferences.remove({ key: ACTIVE_HUNT_STORAGE_KEY });
    }
  }

  private async restoreActiveHuntProgress(): Promise<void> {
    const { value } = await Preferences.get({ key: ACTIVE_HUNT_STORAGE_KEY });
    if (!value) {
      return;
    }
    try {
      const parsed = JSON.parse(value) as PersistedActiveHuntProgress;
      const huntInfo = SCHNITZELHUNTS.find((hunt) => hunt.id === parsed.infoId);
      if (!huntInfo) {
        await Preferences.remove({ key: ACTIVE_HUNT_STORAGE_KEY });
        return;
      }
      const clampedTaskIndex = Math.min(Math.max(parsed.currentTask, 0), huntInfo.tasks.length - 1);
      const restoredHunt: ActiveSchnitzelhunt = {
        id: parsed.activeHuntId,
        info: huntInfo,
        startTime: new Date(parsed.startTimeIso),
        schnitzels: parsed.schnitzels,
        potatoes: parsed.potatoes,
        currentTask: clampedTaskIndex,
      };
      this.activeHunts.set(restoredHunt.id, restoredHunt);
      this.activeHuntsId = Math.max(this.activeHuntsId, restoredHunt.id + 1);
    } catch {
      await Preferences.remove({ key: ACTIVE_HUNT_STORAGE_KEY });
    }
  }

  private async saveCompletedHunts(): Promise<void> {
    const payload: PersistedCompletedHunt[] = Array.from(this.completedHunts.values()).map((hunt) => ({
      id: hunt.id,
      infoId: hunt.info.id,
      schnitzels: hunt.schnitzels,
      potatoes: hunt.potatoes,
      completionDateIso: hunt.completionDate.toISOString(),
      durationMs: hunt.durationMs,
      points: hunt.points,
    }));
    await Preferences.set({
      key: COMPLETED_HUNTS_STORAGE_KEY,
      value: JSON.stringify(payload),
    });
  }

  private async restoreCompletedHunts(): Promise<void> {
    const { value } = await Preferences.get({ key: COMPLETED_HUNTS_STORAGE_KEY });
    if (!value) {
      return;
    }
    try {
      const parsed = JSON.parse(value) as PersistedCompletedHunt[];
      for (const item of
        parsed) {
        const huntInfo = SCHNITZELHUNTS.find((hunt) => hunt.id === item.infoId);
        if (!huntInfo) {
          continue;
        }
        const restored: CompletedSchnitzelhunt = {
          id: item.id,
          info: huntInfo,
          schnitzels: item.schnitzels,
          potatoes: item.potatoes,
          completionDate: new Date(item.completionDateIso),
          durationMs: item.durationMs,
          points: item.points,
        };
        this.completedHunts.set(restored.id, restored);
        this.completedHuntsId = Math.max(this.completedHuntsId, restored.id + 1);
      }
    } catch {
      await Preferences.remove({ key: COMPLETED_HUNTS_STORAGE_KEY });
    }
  }

  private async restoreStoredProgress(): Promise<void> {
    await this.restoreActiveHuntProgress();
    await this.restoreCompletedHunts();
  }
}

const TASKS = [
  {
    type: 'location',
    targetName: 'Migros Kriens Mattenhof',
    targetPos: {
      lat: 47.02760523058052,
      lng: 8.300857384173224,
    },
  } satisfies LocationTask,
  {
    type: 'travel',
    targetDistanceMeters: 50,
  } satisfies TravelTask,
  {
    type: 'scanqr',
    targetValue: 'M335@ICT-BZ',
  } satisfies QrTask,
  {
    type: 'flip',
  } satisfies FlipTask,
  {
    type: 'power',
    requireDisconnect: false,
    requireConnect: true,
  } satisfies PowerTask,
  {
    type: 'wifi',
    requireDisconnect: true,
    requireConnect: true,
  } satisfies WifiTask,
];
const SCHNITZELHUNTS: SchnitzelhuntInfo[] = [
  {
    id: 1,
    name: 'Kriens Explorer Hunt',
    description: 'Explore the city\'s hidden gems.',
    difficulty: 'Easy',
    category: 'Exploration',
    location: 'Kriens',
    tasks: TASKS,
  },
];
