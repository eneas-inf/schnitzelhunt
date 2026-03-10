import { Component, inject } from '@angular/core';
import { BerechtigungenComponent } from '../berechtigungen.component';
import { PermissionService } from '../../../services/permission.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-berechtigungen',
  templateUrl: './location-berechtigungen-page.component.html',
  styleUrls: ['./location-berechtigungen-page.component.scss'],
  imports: [
    BerechtigungenComponent,
  ],
})
export class LocationBerechtigungenPage {
  protected readonly permService = inject(PermissionService);
  protected readonly router = inject(Router);

  protected continueToHome() {
    this.router.navigateByUrl('home');
  }
}
