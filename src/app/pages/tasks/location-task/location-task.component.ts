import { Component, input, OnInit, output, viewChild } from '@angular/core';
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
export class LocationTaskComponent implements TaskComponent<LocationTask>, OnInit {
  private readonly targetMarkerId = 'target';
  private readonly currentPosMarkerId = 'currentPos';
  private readonly closeEnough = 10;

  private readonly map = viewChild.required(SmoothMapComponent);
  readonly task = input.required<LocationTask>();
  readonly taskSolved = output();

  protected mapMarkers: RequiredId<MarkerConfig>[] = [];
  protected mapRoute: RequiredId<RouteConfig> | null = null;
  protected initialPos!: LatLng;

  protected currentPos!: LatLng;
  protected farthestDistance!: number;
  protected posWatchId?: CallbackID;

  get mapId(): string {
    return `map-to-${ this.task().targetName.replace(/\W/, '_') }`;
  }

  get targetPos(): LatLng {
    return this.task().targetPos;
  }

  async ngOnInit(): Promise<void> {
    this.currentPos = await this.getCurrentPosition();
    this.initialPos = this.currentPos;
    this.farthestDistance = this.getMetersLeft();
    this.initMarkers();
    this.refreshRoute();
    this.posWatchId = await Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      enableLocationFallback: true,
      maximumAge: 5000,
    }, (pos, err) => {
      if (err) {
        console.error('Couldn\'t get current position:', err);
      } else if (pos) {
        this.currentPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.checkIfClose();
        this.refreshRoute();
        const distance = this.getMetersLeft();
        if (distance > this.farthestDistance) {
          this.farthestDistance = distance;
        }
        if (this.map().hasLoaded()) {
          console.log('syncing map artifacts');
          this.map().moveTo(this.currentPos);
          this.map().moveMarkerTo(this.currentPosMarkerId, this.currentPos);
          this.map().syncMapArtifacts();
        }
      }
    });
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
        position: this.currentPos,
        icon: 'assets/current-location-icon.svg',
        tooltip: {
          text: 'Current location',
        },
        visible: true,
      },
    ];
  }

  private checkIfClose(): void {
    if (this.getMetersLeft() < this.closeEnough) {
      this.taskSolved.emit();
    }
  }

  private refreshRoute(): void {
    this.mapRoute = {
      id: 'current-to-target-route',
      coordinates: [this.currentPos, this.targetPos],
      color: '#f63b3b',
      width: 3,
      dashed: true,
    };
  }

  getTitle(): string {
    return `Go to ${ this.task().targetName }`;
  }

  getInstructions(): string | null {
    return null;
  }

  getMetersLeft(): number {
    if (!this.currentPos) {
      return 0;
    }
    return fastDistanceMeters(this.currentPos, this.targetPos);
  }

  getProgress(): number {
    if (!this.currentPos) {
      return 0;
    }
    const distance = this.getMetersLeft();
    return distance > this.farthestDistance
      ? 0
      : Math.max(0, Math.min(1, (this.farthestDistance - distance) / this.farthestDistance));
  }
}
