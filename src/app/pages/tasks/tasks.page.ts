import {
  Component,
  inject,
  InputSignal,
  OnDestroy,
  OnInit,
  OutputRef,
  Type,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonProgressBar,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {
  batteryChargingOutline,
  checkmarkCircle,
  chevronForward,
  navigateCircleOutline,
  phonePortraitOutline,
  qrCodeOutline,
  wifiOutline,
} from 'ionicons/icons';
import {SchnitzelhuntService} from '../../services/schnitzelhunt.service';
import {ActiveSchnitzelhunt} from '../../models/schnitzelhunt';
import {firstValueFrom} from 'rxjs';
import {Task} from '../../models/task';
import {addIcons} from 'ionicons';
import {LocationTaskComponent} from './location-task/location-task.component';
import {TravelTaskComponent} from './travel-task/travel-task.component';
import {QrTaskComponent} from './qr-task/qr-task.component';
import {FlipTaskComponent} from './flip-task/flip-task.component';
import {PowerTaskComponent} from './power-task/power-task.component';
import {WifiTaskComponent} from './wifi-task/wifi-task.component';

export interface TaskComponent<T extends Task> {
  task: InputSignal<T>;
  taskSolved: OutputRef<void>;
  icon?: string;
  imageSrc?: string;
  iconType?: 'rotate' | 'large';

  getTitle(): string;

  getInstructions?(): string;
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
    IonProgressBar,

  ],
})
export class TasksPage implements OnInit, OnDestroy {
  private static readonly TASK_TIME_LIMIT_MS = 5 * 60 * 1000;

  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly huntService = inject(SchnitzelhuntService);
  private readonly taskCompRef = viewChild.required('taskCompContainer', {read: ViewContainerRef});

  protected hunt: ActiveSchnitzelhunt | null = null;
  protected currentTask: Task | null = null;
  protected showSuccessPopup = false;
  protected taskComponent: TaskComponent<any> | null = null;
  private currentTaskStartedAt = 0;
  private currentTaskSolved = false;
  private currentTaskSkipped = false;

  protected remainingTimeMs = TasksPage.TASK_TIME_LIMIT_MS;
  private taskTimerId: ReturnType<typeof setInterval> | null = null;
  private taskTimeout: boolean = false;

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
    this.currentTaskStartedAt = Date.now();
    this.currentTaskSolved = false;
    this.currentTaskSkipped = false;
    this.huntService.persistActiveHuntProgress(this.hunt);
    this.createTaskComponent();
    this.startTaskTimer();
  }

  ngOnDestroy(): void {
    this.stopTaskTimer();
  }

  private createTaskComponent() {
    if (!this.currentTask) {
      throw new Error('Current task is not set.');
    }
    this.taskCompRef().clear();
    this.taskComponent = null;
    const cRef = this.taskCompRef().createComponent(this.getTaskComponentType());
    cRef.setInput('task', this.currentTask);
    cRef.instance.taskSolved.subscribe(() => this.onTaskSolved());
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

  onNextTaskClick() {
    if (this.showSuccessPopup) {
      this.nextTask();
      return;
    }
    if (this.currentTaskSolved) {
      this.completeTask();
      return;
    }
    this.skipTask();
  }

  completeTask() {
    if (this.showSuccessPopup) {
      return;
    }
    this.showSuccessPopup = true;
  }

  private onTaskSolved() {
    this.stopTaskTimer();
    this.currentTaskSolved = true;
    this.completeTask();
  }

  getNextButtonLabel(): string {
    return this.showSuccessPopup || this.currentTaskSolved ? 'Next Task' : 'Skip Task';
  }

  skipTask() {
    if (this.showSuccessPopup) {
      return;
    }
    this.stopTaskTimer();
    this.currentTaskSkipped = true;
    this.currentTaskSolved = true;
    this.completeTask();
  }

  nextTask() {
    if (!this.hunt) {
      return;
    }

    this.stopTaskTimer();

    this.applyCurrentTaskReward(this.hunt);
    this.showSuccessPopup = false;
    if (this.hunt.currentTask < this.hunt.info.tasks.length - 1) {
      this.hunt.currentTask++;
      this.currentTask = this.hunt.info.tasks[this.hunt.currentTask] ?? null;
      this.currentTaskStartedAt = Date.now();
      this.currentTaskSolved = false;
      this.currentTaskSkipped = false;
      this.huntService.persistActiveHuntProgress(this.hunt);
      this.createTaskComponent();
      this.startTaskTimer();
    } else {
      const completed = this.huntService.completeSchnitzelhunt(this.hunt);
      this.router.navigate(['/results'], {
        queryParams: {
          status: 'success',
          completedHuntId: completed.id,
        },
      });
    }
  }

  surrender() {
    this.stopTaskTimer();

    if (!this.hunt) {
      this.router.navigate(['/results'], {queryParams: {status: 'failed'}});
      return;
    }

    this.hunt.potatoes += 1;
    this.huntService.persistActiveHuntProgress(this.hunt);
    this.router.navigate(['/results'], {
      queryParams: {
        status: 'failed',
        huntId: this.hunt.id,
      },
    });
  }

  private applyCurrentTaskReward(hunt: ActiveSchnitzelhunt): void {
    if (this.currentTaskSkipped) {
      return;
    }

    if (this.currentTaskSolved) {
      hunt.schnitzels += 1;
      if (this.taskTimeout) {
        hunt.potatoes += 1;
      }
    }
  }

  private startTaskTimer(): void {
    this.stopTaskTimer();
    this.remainingTimeMs = TasksPage.TASK_TIME_LIMIT_MS;
    this.currentTaskStartedAt = Date.now();

    this.taskTimerId = setInterval(() => {
      const elapsedMs = Date.now() - this.currentTaskStartedAt;
      const remaining = Math.max(0, TasksPage.TASK_TIME_LIMIT_MS - elapsedMs);

      this.remainingTimeMs = remaining;

      if (remaining <= 0) {
        this.stopTaskTimer();
        this.taskTimeout = true;
      }
    }, 1000);
  }

  private stopTaskTimer(): void {
    if (this.taskTimerId) {
      clearInterval(this.taskTimerId);
      this.taskTimerId = null;
    }
  }

  protected getRemainingTimeLabel(): string {
    const totalSeconds = Math.ceil(this.remainingTimeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  protected getRemainingTimeProgress(): number {
    return this.remainingTimeMs / TasksPage.TASK_TIME_LIMIT_MS;
  }
}
