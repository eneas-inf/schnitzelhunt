import { Component, input, output } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { QrTask } from '../../../models/task';

@Component({
  selector: 'app-qr-task',
  templateUrl: './qr-task.component.html',
  styleUrls: ['./qr-task.component.scss'],
})
export class QrTaskComponent implements TaskComponent<QrTask> {
  readonly task = input.required<QrTask>();
  readonly taskSolved = output();

  getTitle(): string {
    return 'Scan the QR-Code';
  }

  getInstructions(): string | null {
    return 'Point your camera at the QR code to complete the task.';
  }
}
