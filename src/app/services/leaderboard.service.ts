import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { firstValueFrom, from, Observable } from 'rxjs';

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

interface AggregatedProfile {
  name: string;
  schnitzels: number;
  potatoes: number;
  hunts: number;
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
    const lines = csv
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length <= 1) {
      return [];
    }

    const aggregate = new Map<string, AggregatedProfile>();
    for (const row of lines.slice(1)) {
      const cols = this.parseCsvLine(row);
      if (cols.length < 5) {
        continue;
      }

      const name = (cols[1] ?? '').trim() || 'unknown';
      const schnitzels = this.parseNumber(cols[3]);
      const potatoes = this.parseNumber(cols[4]);

      const current = aggregate.get(name);
      if (current) {
        current.schnitzels += schnitzels;
        current.potatoes += potatoes;
        current.hunts += 1;
      } else {
        aggregate.set(name, {
          name,
          schnitzels,
          potatoes,
          hunts: 1,
        });
      }
    }

    return Array.from(aggregate.values())
      .map((entry) => ({
        name: entry.name,
        hunts: entry.hunts,
        points: this.calculatePoints(entry.schnitzels, entry.potatoes),
      }))
      .sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        if (b.hunts !== a.hunts) {
          return b.hunts - a.hunts;
        }
        return a.name.localeCompare(b.name);
      });
  }

  private parseCsvLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i]!;
      if (ch === '"') {
        const next = line[i + 1];
        if (inQuotes && next === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    values.push(current);
    return values;
  }

  private parseNumber(value: string | undefined): number {
    const parsed = Number((value ?? '').trim().replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private calculatePoints(schnitzels: number, potatoes: number): number {
    return Math.max(0, (schnitzels * 10) - (potatoes * 5));
  }
}
