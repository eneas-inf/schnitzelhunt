import { Injectable } from '@angular/core';
import { ActiveSchnitzelhunt, CompletedSchnitzelhunt, SchnitzelhuntInfo } from '../models/schnitzelhunt';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SchnitzelhuntService {
  private activeHuntsId = 1;
  private completedHuntsId = 1;

  public getSchnitzelhunts(): Observable<SchnitzelhuntInfo[]> {
    return of(MOCK_SCHNITZELHUNTS);
  }

  public getSchnitzelhunt(id: number): Observable<SchnitzelhuntInfo> {
    const found = MOCK_SCHNITZELHUNTS.find(hunt => hunt.id === id);
    return found
      ? of(found)
      : throwError(() => new Error('Schnitzelhunt not found'));
  }

  public initSchnitzelhunt(hunt: SchnitzelhuntInfo): ActiveSchnitzelhunt {
    return {
      id: this.activeHuntsId++,
      hunt,
      startTime: new Date(),
      schnitzels: 0,
      potatoes: 0,
      currentTask: 0,
    };
  }

  public completeSchnitzelhunt(activeHunt: ActiveSchnitzelhunt): CompletedSchnitzelhunt {
    return {
      id: this.completedHuntsId++,
      hunt: activeHunt.hunt,
      schnitzels: activeHunt.schnitzels,
      potatoes: activeHunt.potatoes,
      completionDate: new Date(),
      durationMs: new Date().getTime() - activeHunt.startTime.getTime(),
      points: (activeHunt.schnitzels * 10) - (activeHunt.potatoes * 5),
    };
  }
}

const MOCK_SCHNITZELHUNTS: SchnitzelhuntInfo[] = [
  {
    id: 1,
    name: 'Kriens Explorer Hunt',
    description: 'Explore the city\'s hidden gems.',
    difficulty: 'Easy',
    category: 'Exploration',
    location: 'Kriens',
  },
];
