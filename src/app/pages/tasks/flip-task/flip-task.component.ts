import { Component, input, output } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { FlipTask } from '../../../models/task';

@Component({
  selector: 'app-flip-task',
  templateUrl: './flip-task.component.html',
  styleUrls: ['./flip-task.component.scss'],
  imports: [],
})
export class FlipTaskComponent implements TaskComponent<FlipTask> {
  readonly task = input.required<FlipTask>();
  readonly taskSolved = output();
  readonly icon = 'phone-portrait-outline';
  readonly iconType = 'rotate';

  getTitle(): string {
    return 'Flip the phone';
  }

  getInstructions(): string | null {
    return 'Flip the phone to complete the task.';
  }
}
