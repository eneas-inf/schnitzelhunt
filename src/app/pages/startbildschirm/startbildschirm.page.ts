import { Component, inject } from '@angular/core';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { Userservice } from '../../userservice';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-startbildschirm',
  templateUrl: './startbildschirm.page.html',
  styleUrls: ['./startbildschirm.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, RouterLink],
})
export class StartbildschirmPage {
  private router: Router = inject(Router);
  private userService: Userservice = inject(Userservice);
  private permissionService: PermissionService = inject(PermissionService);

  async usernameAlert() {
    const { value, cancelled } = await Dialog.prompt({
      title: 'Username',
      message: 'Please enter your username',
    });

    if (cancelled) {
      return;
    } else {
      this.userService.setUsername(value);
      if (!await this.permissionService.hasCameraPermission()) {
        await this.router.navigate(['/berechtigungen/camera']);
      } else if (await this.permissionService.hasLocationPermission()) {
        await this.router.navigate(['/berechtigungen/location']);
      }
    }
  }
}
