import { Component, inject } from '@angular/core';
import { BerechtigungenComponent } from '../berechtigungen.component';
import { PermissionService } from '../../../services/permission.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camera-berechtigungen',
  templateUrl: './camera-berechtigungen-page.component.html',
  styleUrls: ['./camera-berechtigungen-page.component.scss'],
  imports: [
    BerechtigungenComponent,
  ],
})
export class CameraBerechtigungenPage {
  protected readonly permService = inject(PermissionService);
  protected readonly router = inject(Router);

  protected async toNextPage() {
    if (!await this.permService.hasLocationPermission(true)) {
      await this.router.navigateByUrl('/berechtigungen/location');
    } else {
      await this.router.navigateByUrl('/home');
    }
  }
}
