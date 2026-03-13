import { Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, warningOutline } from 'ionicons/icons';

@Component({
  selector: 'app-task-completed-popup',
  templateUrl: './task-completed-popup.component.html',
  styleUrls: ['./task-completed-popup.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class TaskCompletedPopupComponent {
  readonly skipped = input.required<boolean>();

  constructor() {
    addIcons({
      checkmarkCircle,
      warningOutline,
    });
  }

  protected get title(): string {
    return this.skipped() ? 'Task skipped' : 'Task completed successfully!';
  }

  protected get message(): string {
    return this.skipped()
      ? 'No schnitzel for this one, let us move on to the next task.'
      : 'Congrats! You earned a schnitzel.';
  }
}
