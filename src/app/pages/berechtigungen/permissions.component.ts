import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, location, shieldCheckmarkOutline } from 'ionicons/icons';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-berechtigungen',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
  ],
})
export class PermissionsComponent implements OnInit {
  public icon = input.required<string>();
  public title = input.required<string>();
  public description = input.required<string>();
  public checkPermission = input.required<() => Promise<boolean>>();
  public continue = output<void>();
  private readonly appService = inject(AppService);
  protected hasPermission: boolean = false;

  constructor() {
    addIcons({ camera, location, shieldCheckmarkOutline });
  }

  async ngOnInit() {
    await this.checkHasPermission();
    this.appService.onStateChange().subscribe(state => {
      if (state.isActive) {
        this.checkHasPermission();
      }
    });
  }

  private async checkHasPermission() {
    this.hasPermission = await this.checkPermission()();
    if (this.hasPermission) {
      this.continue.emit();
    }
  }
}
