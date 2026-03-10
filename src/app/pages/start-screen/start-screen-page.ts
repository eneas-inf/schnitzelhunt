import { Component, inject } from '@angular/core';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { UserService } from '../../services/user.service';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen-page.html',
  styleUrls: ['./start-screen-page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, RouterLink],
})
export class StartScreenPage {
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
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

      if (!await this.permissionService.hasCameraPermission(true)) {
        await this.router.navigate(['/berechtigungen/camera']);
      } else {
        if (!await this.permissionService.hasLocationPermission(true)) {
          await this.router.navigate(['/berechtigungen/location']);
        } else {
          await this.router.navigate(['/home']);
        }
      }
    }
  }
}
