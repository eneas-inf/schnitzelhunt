import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { MapComponent, MarkerConfig, MarkerService, RouteComponent, RouteConfig, ZoomControlComponent } from 'ng-mapcn';
import { LngLat, MapLibreMap } from 'maplibre-gl';
import { fastDistanceMeters, LatLng } from '../tasks/location-task/distance-helper';

export type RequiredId<T extends { id?: string }> = Omit<T, 'id'> & Required<Pick<T, 'id'>>;

@Component({
  selector: 'app-smooth-map',
  templateUrl: './smooth-map.component.html',
  styleUrls: ['./smooth-map.component.scss'],
  imports: [
    ZoomControlComponent,
    RouteComponent,
    MapComponent,
  ],
})
export class SmoothMapComponent implements OnInit, OnDestroy {
  public readonly mapId = input.required<string>();
  public readonly markers = input.required<RequiredId<MarkerConfig>[]>();
  public readonly routes = input.required<RequiredId<RouteConfig>[]>();
  public readonly initialPosition = input.required<LatLng>();
  public readonly initialZoom = input.required<number>();

  private readonly markerService = inject(MarkerService);

  protected readonly osmStyle = '/assets/openstreetmap/style.json';
  protected mapView?: MapLibreMap;
  protected routeConfigs: RouteConfig[] = [];

  private markerAnimationFrame?: number;
  private readonly markerAnimationDurationMs = 350;
  private readonly mapFollowDurationMs = 550;
  private readonly mapFollowMinIntervalMs = 250;
  private readonly markerMinMoveMeters = 1;
  private lastMapFollowAt = 0;
  private initialViewportApplied = false;

  async ngOnInit(): Promise<void> {
    this.syncMapArtifacts();
  }

  ngOnDestroy(): void {
    if (this.markerAnimationFrame) {
      cancelAnimationFrame(this.markerAnimationFrame);
      this.markerAnimationFrame = undefined;
    }
    this.markerService.removeAllMarkers(this.mapId());
  }

  protected initMap(map: MapLibreMap): void {
    this.mapView = map;
    this.installMissingImageFallback(this.mapView);
    this.mapView.touchZoomRotate.enable();
    this.mapView.doubleClickZoom.enable();
    this.syncMapArtifacts();
    document.querySelector('.maplibregl-ctrl-bottom-right')?.remove();
  }

  private installMissingImageFallback(map: MapLibreMap): void {
    const handledMissingImages = new Set<string>();
    map.on('styleimagemissing', (event: { id: string }) => {
      const missingId = event?.id;
      if (!missingId || handledMissingImages.has(missingId) || map.hasImage(missingId)) {
        return;
      }
      handledMissingImages.add(missingId);
      map.addImage(missingId, {
        width: 1,
        height: 1,
        data: new Uint8Array([0, 0, 0, 0]),
      });
    });
  }

  public syncMapArtifacts(): void {
    if (!this.mapView) {
      return;
    }
    this.syncMarkers(this.mapView);
    this.syncRoutes();
    this.syncInitialViewport(this.mapView);
  }

  private syncMarkers(map: MapLibreMap) {
    // @formatter:off
    for (const marker of this.markers()) {
      // @formatter:on
      if (!this.markerService.getMarker(this.mapId(), marker.id)) {
        this.markerService.addMarker(this.mapId(), marker, map);
      }
    }
  }

  private syncRoutes() {
    this.routeConfigs = [...this.routes()];
  }

  private syncInitialViewport(map: MapLibreMap) {
    if (!this.initialViewportApplied) {
      this.initialViewportApplied = true;
      requestAnimationFrame(() => {
        map.easeTo({
          center: this.initialPosition(),
          zoom: this.initialZoom(),
          duration: 800,
          essential: true,
          easing: (t: number) => t * (2 - t),
        });
      });
    }
  }

  public hasLoaded(): boolean {
    return !!this.mapView;
  }

  public moveTo(nextPos: LatLng): void {
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

  public moveMarkerTo(markerId: string, nextPos: LatLng) {
    const markerDef = this.markers().find(m => m.id === markerId);
    const marker = !markerDef ? null : this.markerService.getMarker(this.mapId(), markerId);
    if (!this.mapView || !markerDef || !marker) {
      return;
    }
    const previousPos = LngLat.convert(markerDef.position);
    markerDef.position = nextPos;
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
}
