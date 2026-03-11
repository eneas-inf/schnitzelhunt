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
        this.currentPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const distance = this.getMetersLeft();
        if (distance > this.farthestDistance) {
          this.farthestDistance = distance;
        }
        if (this.mapView) {
          const posMarker = this.markerService.getMarker(this.mapId, 'currentPos');
          if (posMarker) {
            posMarker.setLngLat(this.currentPos);
          }
        }
      }
    });
  }

  initMap(): void {
    this.mapView = this.mapService.getMap(this.mapId)!;
    setTimeout(() => this.mapView!.jumpTo({ center: this.currentPos, zoom: 18 }), 0);
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
    return Math.max(0, Math.min(1, this.farthestDistance - this.getMetersLeft()));
  }
}
