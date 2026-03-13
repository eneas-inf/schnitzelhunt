import { Injectable } from '@angular/core';
import { Camera, CameraPermissionState } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { PermissionState } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  public async hasCameraPermission(prompt?: boolean): Promise<boolean> {
    const state = (await Camera.checkPermissions()).camera;
    if (state !== 'granted' && prompt && this.canPrompt(state)) {
      return (await Camera.requestPermissions({ permissions: ['camera'] })).camera === 'granted';
    }
    return state === 'granted';
  }

  public async hasLocationPermission(prompt?: boolean): Promise<boolean> {
    const state = (await Geolocation.checkPermissions()).location;
    if (state !== 'granted' && prompt && this.canPrompt(state)) {
      return (await Geolocation.requestPermissions({ permissions: ['location'] })).location === 'granted';
    }
    return state === 'granted';
  }

  private canPrompt(state: PermissionState | CameraPermissionState) {
    return state === 'prompt' || state === 'prompt-with-rationale';
  }
}
