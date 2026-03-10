import { Component, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButton, 
  IonIcon, 
  IonProgressBar
} from '@ionic/angular/standalone';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  navigateCircleOutline, 
  checkmarkCircle, 
  qrCodeOutline, 
  phonePortraitOutline, 
  batteryChargingOutline, 
  wifiOutline,
  chevronForward
} from 'ionicons/icons';

interface Task {
  id: number;
  type: 'location' | 'distance' | 'scan' | 'flip' | 'power' | 'wifi';
  title: string;
  description: string;
  progress: number;
  total: number;
  unit?: string;
  status: 'pending' | 'completed';
  icon?: string;
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
    IonProgressBar
  ]
})
export class TasksPage implements OnInit {
  // Mock Data for the 6 Tasks (Reduced from 7)
  tasks: Task[] = [
    { id: 1, type: 'location', title: 'Go to Migros', description: 'Distance: 172 meters', progress: 0.75, total: 1, unit: 'destination', status: 'pending' },
    { id: 2, type: 'distance', title: 'Walk 50 Meters', description: '18 Meters left..', progress: 0.64, total: 1, unit: 'Meters left', status: 'pending' },
    { id: 3, type: 'scan', title: 'Scan the QR-Code', description: 'Point your camera at the QR code to complete the task.', progress: 0, total: 1, status: 'pending' },
    { id: 4, type: 'flip', title: 'Flip the phone', description: 'Flip your phone to complete the task.', progress: 0, total: 1, status: 'pending' },
    { id: 5, type: 'power', title: 'Connect to power', description: 'Connect the device to a charger.', progress: 0, total: 1, status: 'pending' },
    { id: 6, type: 'wifi', title: 'Reconnect to WIFI', description: 'Disconnect the device from WIFI network and than reconnect again.', progress: 0, total: 1, status: 'pending' }
  ];

  currentTaskIndex = 0;
  showSuccessPopup = false;

  get currentTask(): Task {
    return this.tasks[this.currentTaskIndex];
  }

  get progressValue(): number {
    return this.currentTask.progress;
  }

  constructor(private router: Router, private route: ActivatedRoute) {
    addIcons({ 
      navigateCircleOutline, 
      checkmarkCircle, 
      qrCodeOutline, 
      phonePortraitOutline, 
      batteryChargingOutline, 
      wifiOutline,
      chevronForward
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const taskId = params.get('id');
      if (taskId) {
        const index = this.tasks.findIndex(t => t.id === +taskId);
        if (index !== -1) {
          this.currentTaskIndex = index;
        }
      }
    });
  }

  completeTask() {
    this.showSuccessPopup = true;
  }

  nextTask() {
    this.showSuccessPopup = false;
    if (this.currentTaskIndex < this.tasks.length - 1) {
      const nextTaskId = this.tasks[this.currentTaskIndex + 1].id;
      this.router.navigate(['/tasks', nextTaskId]);
    } else {
      // Finished all tasks
      this.router.navigate(['/results'], { queryParams: { status: 'success' } });
    }
  }

  surrender() {
    this.router.navigate(['/results'], { queryParams: { status: 'failed' } });
  }
}
