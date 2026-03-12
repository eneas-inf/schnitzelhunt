import { Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { FlipTask } from '../../../models/task';
import { PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';

@Component({
  selector: 'app-flip-task',
  templateUrl: './flip-task.component.html',
  styleUrls: ['./flip-task.component.scss'],
  imports: [],
})
export class FlipTaskComponent implements TaskComponent<FlipTask>, OnInit, OnDestroy {
  readonly task = input.required<FlipTask>();
  readonly taskSolved = output();
  readonly icon = 'phone-portrait-outline';
  readonly iconType = 'rotate';

  private motionHandler: PluginListenerHandle | null = null;
  private wasFaceUp: boolean = false;
  private solved: boolean = false;

  async ngOnInit(): Promise<void> {
    await this.startListening();
  }

  async ngOnDestroy(): Promise<void> {
    await this.stopListening();
  }

  getTitle(): string {
    return 'Flip the phone';
  }

  getInstructions(): string {
    return 'Flip the phone to complete the task.';
  }

  getProgress(): number {
    return this.solved ? 1 : 0;
  }

  private async startListening(): Promise<void> {
    try {
      this.motionHandler = await Motion.addListener('accel', (event) => {
        const z = event.accelerationIncludingGravity?.z;

        if (typeof z !== 'number' || this.solved) {
          return;
        }

        if (z > 7) {
          this.wasFaceUp = true;
        }

        if (this.wasFaceUp && z < -7) {
          this.solved = true;
          this.taskSolved.emit();
          void this.stopListening();
        }
      });
    } catch (error) {
      console.error('Could not start motion listener', error);
    }
  }

  private async stopListening(): Promise<void> {
    if (this.motionHandler) {
      await this.motionHandler.remove();
      this.motionHandler = null;
    }
    await Motion.removeAllListeners();
  }
}
