import { Component, input, output } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { WifiTask } from '../../../models/task';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-wifi-task',
  templateUrl: './wifi-task.component.html',
  styleUrls: ['./wifi-task.component.scss'],
  imports: [
    NgClass,
  ],
})
export class WifiTaskComponent implements TaskComponent<WifiTask> {
  readonly task = input.required<WifiTask>();
  readonly taskSolved = output();
  readonly icon = 'wifi-outline';
  readonly iconType = 'large';

  getTitle(): string {
    return this.isInitiallyConnected ? 'Disconnect from WIFI' : 'Connect to WIFI';
  }

  getInstructions(): string | null {
    return null;
  }

  getCustomInstructions(): string {
    return this.isInitiallyConnected
      ? 'Disconnect the device from the connected WIFI network.'
      : 'Connect the device to a WIFI network.';
  }

  get isInitiallyConnected(): boolean {
    return false; // TODO
  }

  getTargetStatus(): 'Connected' | 'Disconnected' {
    return 'Connected';
  }

  getStatus(): 'Connected' | 'Disconnected' {
    return 'Disconnected'; //TODO
  }
}
