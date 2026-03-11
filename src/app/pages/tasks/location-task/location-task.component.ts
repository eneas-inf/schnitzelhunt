import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, input, OnDestroy, OnInit, output, viewChild } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { LocationTask } from '../../../models/task';
import { IonProgressBar } from '@ionic/angular/standalone';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { environment } from '../../../../environments/environment';

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
      const currentPos: LatLng = await Geolocation.getCurrentPosition()
        .then(pos => ({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
      console.log('gmap api key:', environment.googleMapsApiKey);
      this.gMap = await GoogleMap.create({
        id: `map-to-${ this.task().targetName.replace(/[^\w]/, '_') }`,
        element: this.mapRef().nativeElement,
        apiKey: environment.googleMapsApiKey,
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
    } finally {
      this.mapLoading = false;
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
