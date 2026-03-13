import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { firstValueFrom, from, Observable } from 'rxjs';
import Parser from '@gregoranders/csv';

const LEADERBOARD_CACHE_STORAGE_KEY = 'leaderboard_cache';
const LEADERBOARD_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1OEBk7B_hCA40IZK-LXOxXMh8N7aH0lWUBwJ_9OVPnnQ/export?format=csv&gid=1157247996';
const LEADERBOARD_FORM_URL =
  'https://docs.google.com/forms/u/0/d/e/1FAIpQLSe_rr4dfM11mWhSKwbjwoIzEDPi9ahrEsAsHhESicJ9zS9lTw/formResponse';

export interface LeaderboardEntry {
  name: string;
  points: number;
  hunts: number;
}

export interface LeaderboardRunPayload {
  name: string;
  schnitzelCount: number;
  potatoCount: number;
  duration: string;
}

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly http = inject(HttpClient);

  getLeaderboard(): Observable<LeaderboardEntry[]> {
    return from(this.loadLeaderboard());
  }

  async submitOnlineRun(payload: LeaderboardRunPayload): Promise<void> {
    const body = new URLSearchParams();
    body.set('entry.1860183935', payload.name);
    body.set('entry.564282981', payload.schnitzelCount.toString());
    body.set('entry.1079317865', payload.potatoCount.toString());
    body.set('entry.985590604', payload.duration);

    try {
      await firstValueFrom(this.http.post(LEADERBOARD_FORM_URL, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }));
    } catch (err) {
      console.warn('CORS warning (usually successful anyway)', err);
    }
  }

  private async loadLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const csv = await firstValueFrom(
        this.http.get(LEADERBOARD_CSV_URL, { responseType: 'text' }),
      );
      const entries = this.parseLeaderboardCsv(csv);
      await Preferences.set({
        key: LEADERBOARD_CACHE_STORAGE_KEY,
        value: JSON.stringify(entries),
      });
      return entries;
    } catch {
      return this.getCachedLeaderboard();
    }
  }

  private async getCachedLeaderboard(): Promise<LeaderboardEntry[]> {
    const { value } = await Preferences.get({ key: LEADERBOARD_CACHE_STORAGE_KEY });
    if (!value) {
      return [];
    }
    try {
      const parsed = JSON.parse(value) as LeaderboardEntry[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private parseLeaderboardCsv(csv: string): LeaderboardEntry[] {
    const csvParser = new Parser();
    csvParser.parse(csv);
    const csvRows = csvParser.json as {
      Zeitstempel: string,
      Name: string,
      Dauer: string,
      Schnitzel: string,
      Kartoffeln: string,
    }[];
    const people = new Map<string, LeaderboardEntry>();
    for (const row of csvRows) {
      const points = this.calculatePoints(parseInt(row.Schnitzel, 10) || 0, parseInt(row.Kartoffeln, 10) || 0);
      let person = people.get(row.Name);
      if (person) {
        person.hunts++;
        person.points += points;
      } else {
        person = {
          name: row.Name,
          points,
          hunts: 1,
        };
        people.set(row.Name, person);
      }
    }
    return Array.from(people.values()).sort((e1, e2) => {
      if (e2.points !== e1.points) {
        return e2.points - e1.points;
      }
      if (e2.hunts !== e1.hunts) {
        return e2.hunts - e1.hunts;
      }
      return e1.name.localeCompare(e2.name);
    });
  }

  public calculatePoints(schnitzels: number, potatoes: number): number {
    return Math.max(0, (schnitzels * 10) - (potatoes * 5));
  }
}
