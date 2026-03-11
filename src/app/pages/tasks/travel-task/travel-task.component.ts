import { Component, input, output } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { TravelTask } from '../../../models/task';

@Component({
  selector: 'app-travel-task',
  templateUrl: './travel-task.component.html',
  styleUrls: ['./travel-task.component.scss'],
})
export class TravelTaskComponent implements TaskComponent<TravelTask> {
  readonly task = input.required<TravelTask>();
  readonly taskSolved = output();

  getTitle(): string {
    return `Walk ${ this.task().targetDistanceMeters } Meters`;
  }

  getInstructions(): string | null {
    return `${ this.getMetersLeft() } Meters left..`;
  }

  getMetersLeft(): number {
    return 14; // TODO
  }

  getProgress(): number {
    return 0.23; // TODO
  }
}
