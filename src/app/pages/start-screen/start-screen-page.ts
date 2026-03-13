import { Component, inject } from '@angular/core';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { UserService } from '../../services/user.service';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen-page.html',
  styleUrls: ['./start-screen-page.scss'],
  standalone: true,
  imports: [IonContent, IonButton],
})
export class StartScreenPage {
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private permissionService: PermissionService = inject(PermissionService);

  async usernameAlert() {
    if (await this.userService.getUsername()) {
      await this.navigateAfterUsername();
      return;
    }

    const { value, cancelled } = await Dialog.prompt({
      title: 'Username',
      message: 'Please enter your username',
    });

    if (cancelled || value.trim() === '') {
      return;
    }

    this.userService.setUsername(value);
    await this.navigateAfterUsername();
  }

  private async navigateAfterUsername(): Promise<void> {
    if (!await this.permissionService.hasCameraPermission(true)) {
      await this.router.navigate(['/permissions/camera']);
      return;
    }
    if (!await this.permissionService.hasLocationPermission(true)) {
      await this.router.navigate(['/permissions/location']);
      return;
    }
    await this.router.navigate(['/home']);
  }
}
