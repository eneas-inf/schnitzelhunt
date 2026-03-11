import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, input, OnDestroy, OnInit, output, viewChild } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { LocationTask } from '../../../models/task';
import { IonProgressBar } from '@ionic/angular/standalone';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';

@Component({
  selector: 'app-location-task',
  templateUrl: './location-task.component.html',
  styleUrls: ['./location-task.component.scss'],
  imports: [
    IonProgressBar,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LocationTaskComponent implements TaskComponent<LocationTask>, OnInit, OnDestroy {
  private readonly mapRef = viewChild.required<ElementRef>('map');
  readonly task = input.required<LocationTask>();
  readonly taskSolved = output();

  protected mapLoading = true;
  private gMap?: GoogleMap;

  async ngOnInit() {
    this.mapLoading = true;
    try {
      const currentPos = await this.getCurrentPositionOrFallback();
      this.gMap = await GoogleMap.create({
        id: `map-to-${ this.task().targetName.replace(/[^\w]/, '_') }`,
        element: this.mapRef().nativeElement,
        apiKey: 'environment.googleMapsApiKey',
        config: {
          center: this.task().targetPos,
          zoom: 15,
          streetViewControl: false,
        } as any,
      });
      await this.gMap.addMarkers([{
        title: this.task().targetName,
        coordinate: this.task().targetPos,
      }]);
      await this.gMap.setCamera({ coordinate: currentPos, animate: true, animationDuration: 2000 });
      await this.gMap.addPolylines([{
        path: this.createStraightPath(currentPos, this.task().targetPos),
        strokeColor: 'red',
        strokeOpacity: 0.5,
      }] as any);
    } catch (error) {
      console.error('Could not initialize map task', error);
    } finally {
      this.mapLoading = false;
    }
  }

  private async getCurrentPositionOrFallback(): Promise<LatLng> {
    try {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        enableLocationFallback: true,
        maximumAge: 5000,
      });
      return { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch (error) {
      console.warn('Location timeout/unavailable, using task target as fallback', error);
      return this.task().targetPos;
    }
  }

  private createStraightPath(start: LatLng, end: LatLng, steps = 50): LatLng[] {
    return Array.from({ length: steps }, (_, i) => {
      const t = i / steps;
      return {
        lat: start.lat + (end.lat - start.lat) * t,
        lng: start.lng + (end.lng - start.lng) * t,
      };
    });
  }

  ngOnDestroy() {
    this.gMap?.destroy();
  }

  getTitle(): string {
    return `Go to ${ this.task().targetName }`;
  }

  getInstructions(): string | null {
    return null;
  }

  getMetersLeft(): number {
    return 2; // TODO
  }

  getProgress(): number {
    return 0.67; // TODO
  }
}
