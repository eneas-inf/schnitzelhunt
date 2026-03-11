import { Component, input, output } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { LocationTask } from '../../../models/task';
import { IonIcon, IonProgressBar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-location-task',
  templateUrl: './location-task.component.html',
  styleUrls: ['./location-task.component.scss'],
  imports: [
    IonProgressBar,
    IonIcon,
  ],
})
export class LocationTaskComponent implements TaskComponent<LocationTask> {
  readonly task = input.required<LocationTask>();
  readonly taskSolved = output();

  getTitle(): string {
    return `Go to ${ this.task().targetName }`;
  }

  getInstructions(): string | null {
    return null;
  }

  getMetersLeft(): number {
    return 2; // TODO
  }

  getProgress(): number {
    return 0.67; // TODO
  }
}
