import { Component, inject, inputBinding, InputSignal, OnInit, outputBinding, OutputRef, signal, Type, viewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { batteryChargingOutline, checkmarkCircle, chevronForward, navigateCircleOutline, phonePortraitOutline, qrCodeOutline, wifiOutline } from 'ionicons/icons';
import { SchnitzelhuntService } from '../../services/schnitzelhunt.service';
import { ActiveSchnitzelhunt } from '../../models/schnitzelhunt';
import { firstValueFrom } from 'rxjs';
import { Task } from '../../models/task';
import { addIcons } from 'ionicons';
import { LocationTaskComponent } from './location-task/location-task.component';
import { TravelTaskComponent } from './travel-task/travel-task.component';
import { QrTaskComponent } from './qr-task/qr-task.component';
import { FlipTaskComponent } from './flip-task/flip-task.component';
import { PowerTaskComponent } from './power-task/power-task.component';
import { WifiTaskComponent } from './wifi-task/wifi-task.component';

export interface TaskComponent<T extends Task> {
  task: InputSignal<T>;
  taskSolved: OutputRef<void>;
  icon?: string;
  iconType?: 'rotate' | 'large';

  getTitle(): string;

  getInstructions(): string | null;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,

  ],
})
export class TasksPage implements OnInit {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly huntService = inject(SchnitzelhuntService);
  private readonly taskCompRef = viewChild.required('taskCompContainer', { read: ViewContainerRef });

  protected hunt: ActiveSchnitzelhunt | null = null;
  protected currentTask: Task | null = null;
  protected showSuccessPopup = false;
  protected taskComponent: TaskComponent<any> | null = null;

  constructor() {
    addIcons({
      navigateCircleOutline,
      checkmarkCircle,
      qrCodeOutline,
      phonePortraitOutline,
      batteryChargingOutline,
      wifiOutline,
      chevronForward,
    });
  }

  async ngOnInit() {
    const params = this.activeRoute.snapshot.paramMap;
    const huntId = parseInt(params.get('huntid')!, 10);
    this.hunt = await firstValueFrom(this.huntService.getActiveHunt(huntId));
    this.currentTask = this.hunt.info.tasks[this.hunt.currentTask]!;
    this.huntService.persistActiveHuntProgress(this.hunt);
    this.createTaskComponent();
  }

  private createTaskComponent() {
    this.taskCompRef().clear();
    this.taskComponent = null;
    const cRef = this.taskCompRef().createComponent(
      this.getTaskComponentType(), {
        bindings: [
          inputBinding('task', signal(this.currentTask)),
          outputBinding('taskSolved', () => this.completeTask()),
        ],
      });
    cRef.changeDetectorRef.detectChanges();
    this.taskComponent = cRef.instance;
  }

  private getTaskComponentType(): Type<TaskComponent<any>> {
    if (!this.currentTask) {
      throw new Error('Current task is not set.');
    }
    switch (this.currentTask.type) {
      case 'location':
        return LocationTaskComponent;
      case 'travel':
        return TravelTaskComponent;
      case 'scanqr':
        return QrTaskComponent;
      case 'flip':
        return FlipTaskComponent;
      case 'power':
        return PowerTaskComponent;
      case 'wifi':
        return WifiTaskComponent;
    }
  }

  completeTask() {
    this.showSuccessPopup = true;
  }

  nextTask() {
    if (!this.hunt) {
      return;
    }

    this.showSuccessPopup = false;
    if (this.hunt.currentTask < this.hunt.info.tasks.length - 1) {
      this.hunt.currentTask++;
      this.currentTask = this.hunt.info.tasks[this.hunt.currentTask] ?? null;
      this.huntService.persistActiveHuntProgress(this.hunt);
      this.createTaskComponent();
    } else {
      const completed = this.huntService.completeSchnitzelhunt(this.hunt);
      this.router.navigate(['/results'], { queryParams: { status: 'success', completedId: completed.id } });
    }
  }

  surrender() {
    if (this.hunt) {
      this.huntService.clearPersistedActiveHuntProgress(this.hunt.id);
    }
    this.router.navigate(['/results'], { queryParams: { status: 'failed' } });
  }
}
