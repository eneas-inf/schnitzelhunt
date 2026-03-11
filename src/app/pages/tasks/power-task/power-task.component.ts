import { Component, input, output } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { PowerTask } from '../../../models/task';

@Component({
  selector: 'app-power-task',
  templateUrl: './power-task.component.html',
  styleUrls: ['./power-task.component.scss'],
  imports: [],
})
export class PowerTaskComponent implements TaskComponent<PowerTask> {
  readonly task = input.required<PowerTask>();
  readonly taskSolved = output();
  readonly icon = 'battery-charging-outline';
  readonly iconType = 'large';

  getTitle(): string {
    return 'Connect to power';
  }

  getInstructions(): string | null {
    return 'Connect the device to a charger.';
  }
}
