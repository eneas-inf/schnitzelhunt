import { Component, inject } from '@angular/core';
import { PermissionsComponent } from '../permissions.component';
import { PermissionService } from '../../../services/permission.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-permissions',
  templateUrl: './location-permissions-page.html',
  styleUrls: ['./location-permissions-page.scss'],
  imports: [
    PermissionsComponent,
  ],
})
export class LocationBerechtigungenPage {
  protected readonly permService = inject(PermissionService);
  protected readonly router = inject(Router);

  protected toHomePage() {
    this.router.navigateByUrl('/home');
  }
}
