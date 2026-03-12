import { Component, computed, input, OnDestroy, OnInit, output, signal, viewChild } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { LocationTask } from '../../../models/task';
import { IonProgressBar } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { RequiredId, SmoothMapComponent } from '../../smooth-map/smooth-map.component';
import { CallbackID, Geolocation } from '@capacitor/geolocation';
import { fastDistanceMeters, LatLng } from './distance-helper';
import { MarkerConfig, RouteConfig } from 'ng-mapcn';

@Component({
  selector: 'app-location-task',
  templateUrl: './location-task.component.html',
  styleUrls: ['./location-task.component.scss'],
  imports: [
    IonProgressBar,
    DecimalPipe,
    SmoothMapComponent,
  ],
})
export class LocationTaskComponent implements TaskComponent<LocationTask>, OnInit, OnDestroy {
  private readonly targetMarkerId = 'target';
  private readonly currentPosMarkerId = 'currentPos';
  private readonly closeEnough = 5;
  private readonly instanceId = `${ Date.now() }-${ Math.random().toString(36).slice(2, 8) }`;

  private readonly map = viewChild.required(SmoothMapComponent);
  readonly task = input.required<LocationTask>();
  readonly taskSolved = output();

  protected mapMarkers: RequiredId<MarkerConfig>[] = [];
  protected initialPos!: LatLng;

  protected currentPos = signal<LatLng | null>(null);
  protected farthestDistance = signal<number | null>(null);
  protected posWatchId?: CallbackID;
  private solved: boolean = false;

  protected readonly metersLeft = computed<number>(() => {
    return !this.currentPos() ? 0 : fastDistanceMeters(this.currentPos()!, this.targetPos);
  });

  protected readonly progress = computed<number>(() => {
    const pos = this.currentPos();
    const farthest = this.farthestDistance();
    if (!pos || !farthest) {
      return 0;
    }
    const distance = this.metersLeft();
    return distance > farthest
      ? 0
      : Math.max(0, Math.min(1, (farthest - distance) / farthest));
  });

  protected readonly mapRoute = computed<RequiredId<RouteConfig> | null>(() => {
    const pos = this.currentPos();
    if (!pos) {
      return null;
    }
    return {
      id: 'current-to-target-route',
      coordinates: [pos, this.targetPos],
      color: '#f63b3b',
      width: 3,
      dashed: true,
    };
  });

  get mapId(): string {
    return `map-to-${ this.task().targetName.replace(/\W/g, '_') }-${ this.instanceId }`;
  }

  get targetPos(): LatLng {
    return this.task().targetPos;
  }

  async ngOnInit(): Promise<void> {
    this.currentPos.set(await this.getCurrentPosition());
    this.initialPos = this.currentPos()!;
    this.farthestDistance.set(this.metersLeft());
    this.initMarkers();
    this.posWatchId = await Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      enableLocationFallback: true,
      maximumAge: 5000,
    }, (pos, err) => {
      if (err) {
        console.error('Couldn\'t get current position:', err);
      } else if (pos) {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.currentPos.set(newPos);
        this.checkIfClose();
        const distance = this.metersLeft();
        if (distance > (this.farthestDistance() ?? 0)) {
          this.farthestDistance.set(distance);
        }
        if (this.map().hasLoaded()) {
          this.map().moveTo(newPos);
          this.map().moveMarkerTo(this.currentPosMarkerId, newPos);
          this.map().syncMapArtifacts();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.posWatchId) {
      Geolocation.clearWatch({ id: this.posWatchId });
      this.posWatchId = undefined;
    }
  }

  private async getCurrentPosition(): Promise<LatLng> {
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      enableLocationFallback: true,
      maximumAge: 5000,
    });
    return ({ lat: pos.coords.latitude, lng: pos.coords.longitude });
  }

  private initMarkers(): void {
    this.mapMarkers = [
      {
        id: this.targetMarkerId,
        position: this.targetPos,
        popup: {
          title: this.task().targetName,
        },
        tooltip: {
          text: this.task().targetName,
        },
        icon: 'assets/marker-icon.svg',
        color: '#ff3434',
        visible: true,
      },
      {
        id: this.currentPosMarkerId,
        position: this.currentPos()!,
        icon: 'assets/current-location-icon.svg',
        tooltip: {
          text: 'Current location',
        },
        visible: true,
      },
    ];
  }

  private checkIfClose(): void {
    if (!this.solved && this.currentPos() && this.metersLeft() < this.closeEnough) {
      this.solved = true;
      this.taskSolved.emit();
    }
  }

  getTitle(): string {
    return `Go to ${ this.task().targetName }`;
  }
}
