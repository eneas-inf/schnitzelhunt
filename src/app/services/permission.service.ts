import { Injectable } from '@angular/core';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  public async hasCameraPermission(requestIfPossible?: boolean): Promise<boolean> {
    return (await Camera.checkPermissions()).camera === 'granted';
  }

  public async requestCameraPermission(): Promise<boolean> {
    return (await Camera.requestPermissions({ permissions: ['camera'] })).camera === 'granted';
  }

  public async hasLocationPermission(prompt?: boolean): Promise<boolean> {
    return (await Geolocation.checkPermissions()).location === 'granted';
  }

  public async requestLocationPermission(): Promise<boolean> {
    return (await Geolocation.requestPermissions({ permissions: ['location'] })).location === 'granted';
  }
}
