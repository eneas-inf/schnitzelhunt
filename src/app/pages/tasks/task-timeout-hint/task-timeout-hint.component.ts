import { Component, input } from '@angular/core';

@Component({
  selector: 'app-task-timeout-hint',
  templateUrl: './task-timeout-hint.component.html',
  styleUrls: ['./task-timeout-hint.component.scss'],
  standalone: true,
})
export class TaskTimeoutHintComponent {
  readonly title = input('Time\'s up!');
  readonly message = input('You will receive a potato.');
}
