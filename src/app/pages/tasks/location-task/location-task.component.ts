import { Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { LocationTask } from '../../../models/task';
import { IonProgressBar } from '@ionic/angular/standalone';
import { MapComponent, MapService, MarkerConfig, MarkerService, RouteComponent, RouteConfig, ZoomControlComponent } from 'ng-mapcn';
import { CallbackID, Geolocation } from '@capacitor/geolocation';
import { fastDistanceMeters, LatLng } from './distance-helper';
import { DecimalPipe } from '@angular/common';
import { Map as MapLibreMap } from 'maplibre-gl';

@Component({
  selector: 'app-location-task',
  templateUrl: './location-task.component.html',
  styleUrls: ['./location-task.component.scss'],
  imports: [
    IonProgressBar,
    MapComponent,
    ZoomControlComponent,
    DecimalPipe,
    RouteComponent,
  ],
})
export class LocationTaskComponent implements TaskComponent<LocationTask>, OnInit, OnDestroy {
  private readonly markerService = inject(MarkerService);
  private readonly mapService = inject(MapService);
  readonly task = input.required<LocationTask>();
  readonly taskSolved = output();

  protected mapId!: string;
  protected currentPos!: LatLng;
  protected farthestDistance!: number;
  protected posWatchId?: CallbackID;
  protected mapView?: MapLibreMap;

  private markerAnimationFrame?: number;
  private readonly markerAnimationDurationMs = 350;
  private readonly mapFollowDurationMs = 550;
  private readonly mapFollowMinIntervalMs = 250;
  private readonly markerMinMoveMeters = 1;
  private lastMapFollowAt = 0;

  async ngOnInit(): Promise<void> {
    this.mapId = `map-to-${ this.task().targetName.replace(/\W/, '_') }`;
    this.currentPos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      enableLocationFallback: true,
      maximumAge: 5000,
    }).then(pos => ({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
    this.farthestDistance = this.getMetersLeft();
    this.posWatchId = await Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      enableLocationFallback: true,
      maximumAge: 5000,
    }, (pos, err) => {
      if (err) {
        console.error('Couldn\'t get current position:', err);
      } else if (pos) {
        const previousPos = this.currentPos;
        const nextPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.currentPos = nextPos;
        const distance = this.getMetersLeft();
        if (distance > this.farthestDistance) {
          this.farthestDistance = distance;
        }
        if (this.mapView) {
          const posMarker = this.markerService.getMarker(this.mapId, 'currentPos');
          if (posMarker) {
            this.updateMarkerSmooth(posMarker, previousPos, nextPos);
          }
          this.followPositionSmooth(nextPos);
        }
      }
    });
  }

  initMap(): void {
    this.mapView = this.mapService.getMap(this.mapId)!;
    setTimeout(() => {
      this.mapView?.easeTo({
        center: this.currentPos,
        zoom: 18,
        duration: 800,
        essential: true,
        easing: (t: number) => t * (2 - t),
      });
    }, 0);
    this.mapView.touchZoomRotate.enable();
    this.mapView.doubleClickZoom.enable();
    // this.mapView.style.loadURL('assets/openstreetmap/style.json');
    this.markerService.addMarker(this.mapId, this.createTargetMarker(), this.mapView);
    this.markerService.addMarker(this.mapId, this.createCurrentPosMarker(), this.mapView);
    document.querySelector('.maplibregl-ctrl-bottom-right')?.remove();
  }

  private createTargetMarker(): MarkerConfig {
    return {
      id: 'target',
      position: this.getTargetPos(),
      popup: {
        title: this.task().targetName,
      },
      tooltip: {
        text: this.task().targetName,
      },
      icon: 'assets/marker-icon.svg',
      color: '#ff3434',
      visible: true,
    };
  }

  private createCurrentPosMarker(): MarkerConfig {
    return {
      id: 'currentPos',
      position: this.currentPos,
      icon: 'assets/current-location-icon.svg',
      tooltip: {
        text: 'Current location',
      },
      visible: true,
    };
  }

  ngOnDestroy(): void {
    if (this.posWatchId) {
      Geolocation.clearWatch({ id: this.posWatchId });
    }
    if (this.markerAnimationFrame) {
      cancelAnimationFrame(this.markerAnimationFrame);
      this.markerAnimationFrame = undefined;
    }
  }

  private followPositionSmooth(nextPos: LatLng): void {
    if (!this.mapView) {
      return;
    }

    const now = Date.now();
    if (now - this.lastMapFollowAt < this.mapFollowMinIntervalMs) {
      return;
    }

    this.lastMapFollowAt = now;
    this.mapView.easeTo({
      center: nextPos,
      duration: this.mapFollowDurationMs,
      essential: true,
      easing: (t: number) => t * (2 - t),
    });
  }

  private updateMarkerSmooth(marker: any, previousPos: LatLng, nextPos: LatLng): void {
    if (fastDistanceMeters(previousPos, nextPos) < this.markerMinMoveMeters) {
      return;
    }

    if (this.markerAnimationFrame) {
      cancelAnimationFrame(this.markerAnimationFrame);
      this.markerAnimationFrame = undefined;
    }

    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / this.markerAnimationDurationMs);
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      marker.setLngLat({
        lng: previousPos.lng + (nextPos.lng - previousPos.lng) * eased,
        lat: previousPos.lat + (nextPos.lat - previousPos.lat) * eased,
      });

      if (progress < 1) {
        this.markerAnimationFrame = requestAnimationFrame(animate);
      } else {
        this.markerAnimationFrame = undefined;
      }
    };

    this.markerAnimationFrame = requestAnimationFrame(animate);
  }

  private getTargetPos(): LatLng {
    return this.task().targetPos;
  }

  getRouteConfig(): RouteConfig {
    return {
      coordinates: [this.currentPos, this.getTargetPos()],
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
    return fastDistanceMeters(this.currentPos, this.getTargetPos());
  }

  getProgress(): number {
    if (!this.currentPos) {
      return 0;
    }
    const distance = this.getMetersLeft();
    if (distance < this.farthestDistance) {
      return 0;
    }
    return Math.max(0, Math.min(1, this.farthestDistance - this.getMetersLeft()));
  }
}
