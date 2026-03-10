import { Component, inject } from '@angular/core';
import { PermissionsComponent } from '../permissions.component';
import { PermissionService } from '../../../services/permission.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camera-permissions',
  templateUrl: './camera-permissions-page.html',
  styleUrls: ['./camera-permissions-page.scss'],
  imports: [
    PermissionsComponent,
  ],
})
export class CameraPermissionsPage {
  protected readonly permService = inject(PermissionService);
  protected readonly router = inject(Router);

  protected async toNextPage() {
    if (!await this.permService.hasLocationPermission(true)) {
      await this.router.navigateByUrl('/permissions/location');
    } else {
      await this.router.navigateByUrl('/home');
    }
  }
}
