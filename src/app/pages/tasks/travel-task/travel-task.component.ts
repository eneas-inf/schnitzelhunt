import {Component, input, OnDestroy, OnInit, output, signal} from '@angular/core';
import {TaskComponent} from '../tasks.page';
import {TravelTask} from '../../../models/task';
import {Geolocation, Position, WatchPositionCallback} from '@capacitor/geolocation';

@Component({
  selector: 'app-travel-task',
  templateUrl: './travel-task.component.html',
  styleUrls: ['./travel-task.component.scss'],
})
export class TravelTaskComponent implements TaskComponent<TravelTask>, OnInit, OnDestroy {
  readonly task = input.required<TravelTask>();
  readonly taskSolved = output();

  private watchId: string | null = null;
  private lastPosition: Position | null = null;
  private walkedMeters = signal(0);
  private solved: boolean = false;

  async ngOnInit(): Promise<void> {
    await this.startTracking();
  }

  async ngOnDestroy(): Promise<void> {
    await this.stopTracking();
  }

  getTitle(): string {
    return `Walk ${this.task().targetDistanceMeters} Meters`;
  }

  getInstructions(): string | null {
    return `${this.getMetersLeft()} Meters left..`;
  }

  getMetersLeft(): number {
    return Math.max(0, Math.ceil(this.task().targetDistanceMeters - this.walkedMeters()));
  }

  getProgress(): number {
    return Math.min(this.walkedMeters() / this.task().targetDistanceMeters, 1);
  }

  private async startTracking(): Promise<void> {
    try {
      const startPosition = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 1000,
        enableLocationFallback: true,
        maximumAge: 0,
      });

      this.lastPosition = startPosition;

      const callback: WatchPositionCallback = (position, err) => {
        if (err) {
          console.error('watchPosition error', err);
          return;
        }

        if (!position) {
          return;
        }

        if (!this.lastPosition) {
          this.lastPosition = position;
          return;
        }

        const segmentDistance = this.calculateDistanceInMeters(
          this.lastPosition.coords.latitude,
          this.lastPosition.coords.longitude,
          position.coords.latitude,
          position.coords.longitude,
        );

        // if (segmentDistance >= 1) {
        this.walkedMeters.update(current => current + segmentDistance);
        this.lastPosition = position;
        // }

        if (!this.solved && this.walkedMeters() >= this.task().targetDistanceMeters) {
          this.solved = true;
          this.taskSolved.emit();
          void this.stopTracking();
        }
      };

      this.watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 1000,
          enableLocationFallback: true,
          maximumAge: 0,
        },
        callback,
      );
    } catch (error) {
      console.error('Could not start travel task tracking', error);
    }
  }

  private async stopTracking(): Promise<void> {
    if (this.watchId) {
      await Geolocation.clearWatch({id: this.watchId});
      this.watchId = null;
    }
  }

  private calculateDistanceInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const earthRadius = 6371000;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  }
}
