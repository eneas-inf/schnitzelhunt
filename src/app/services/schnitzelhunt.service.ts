import { Injectable } from '@angular/core';
import { ActiveSchnitzelhunt, CompletedSchnitzelhunt, SchnitzelhuntInfo } from '../models/schnitzelhunt';
import { Observable, of, throwError } from 'rxjs';
import { FlipTask, LocationTask, PowerTask, QrTask, TravelTask, WifiTask } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class SchnitzelhuntService {
  private activeHuntsId = 1;
  private completedHuntsId = 1;
  private activeHunts: Map<number, ActiveSchnitzelhunt> = new Map();
  private completedHunts: Map<number, CompletedSchnitzelhunt> = new Map();

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
    return newHunt;
  }

  public getActiveHunt(id: number): Observable<ActiveSchnitzelhunt> {
    return this.throwIfNotFound(this.activeHunts.get(id), 'Active schnitzelhunt not found!');
  }

  public completeSchnitzelhunt(activeHunt: ActiveSchnitzelhunt): CompletedSchnitzelhunt {
    const completed: CompletedSchnitzelhunt = {
      id: this.completedHuntsId++,
      info: activeHunt.info,
      schnitzels: activeHunt.schnitzels,
      potatoes: activeHunt.potatoes,
      completionDate: new Date(),
      durationMs: new Date().getTime() - activeHunt.startTime.getTime(),
      points: (activeHunt.schnitzels * 10) - (activeHunt.potatoes * 5),
    };
    this.activeHunts.delete(activeHunt.id);
    this.completedHunts.set(completed.id, completed);
    return completed;
  }

  public getCompletedHunts(): Observable<CompletedSchnitzelhunt[]> {
    return of(Array.from(this.completedHunts.values()));
  }

  private throwIfNotFound<T>(item: T | null | undefined, msg: string): Observable<T> {
    return item ? of(item) : throwError(() => new Error(msg));
  }
}

const TASKS = [
  {
    type: 'location',
    targetName: 'Migros Kriens',
    targetPos: {
      lng: 47.02760523058052,
      lat: 8.300857384173224,
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
