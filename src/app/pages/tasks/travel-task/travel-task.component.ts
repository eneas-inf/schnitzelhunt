import {Component, input, output, OnInit, OnDestroy} from '@angular/core';
import {TaskComponent} from '../tasks.page';
import {TravelTask} from '../../../models/task';
import {Position} from "@capacitor/geolocation";

@Component({
  selector: 'app-travel-task',
  templateUrl: './travel-task.component.html',
  styleUrls: ['./travel-task.component.scss'],
})
export class TravelTaskComponent implements TaskComponent<TravelTask>, OnInit, OnDestroy {
  readonly task = input.required<TravelTask>();
  readonly taskSolved = output();

  private watchId: number | null = null;
  private lastPosition: Position | null = null;
  private walkedMeters: number = 0;
  private solved: boolean = false;

  ngOnInit(): void {
    this.startTracking();
  }

  ngOnDestroy(): void {
    this.stopTracking();
  }

  getTitle(): string {
    return `Walk ${this.task().targetDistanceMeters} Meters`;
  }

  getInstructions(): string | null {
    return `${this.getMetersLeft()} Meters left..`;
  }

  getMetersLeft(): number {
    return Math.max(0, Math.ceil(this.task().targetDistanceMeters - this.walkedMeters));
  }

  getProgress(): number {
    return Math.min(this.walkedMeters / this.task().targetDistanceMeters, 1);
  }

  private startTracking(): void {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!this.lastPosition) {
          this.lastPosition = position;
          return;
        }

        const segmentDistance = this.calculateDistanceInMeters(
          this.lastPosition.coords.latitude,
          this.lastPosition.coords.longitude,
          position.coords.latitude,
          position.coords.longitude
        );

        if (segmentDistance >= 1) {
          this.walkedMeters += segmentDistance;
          this.lastPosition = position;
        }

        if (!this.solved && this.walkedMeters >= this.task().targetDistanceMeters) {
          this.solved = true;
          this.taskSolved.emit();
          this.stopTracking();
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  }

  private stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  private calculateDistanceInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const earthRadius = 6371000;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }
}
