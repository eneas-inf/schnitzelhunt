import { Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { PowerTask } from '../../../models/task';

interface BatteryManagerLike extends EventTarget {
  charging: boolean;

  addEventListener(type: 'chargingchange', listener: EventListenerOrEventListenerObject): void;

  removeEventListener(type: 'chargingchange', listener: EventListenerOrEventListenerObject): void;
}

@Component({
  selector: 'app-power-task',
  templateUrl: './power-task.component.html',
  styleUrls: ['./power-task.component.scss'],
  imports: [],
})
export class PowerTaskComponent implements TaskComponent<PowerTask>, OnInit, OnDestroy {
  readonly task = input.required<PowerTask>();
  readonly taskSolved = output();
  readonly imageSrc = 'assets/tasks/charge.png';

  protected statusText = 'Checking charging status...';
  protected isCharging = false;

  private battery: BatteryManagerLike | null = null;
  private sawConnect = false;
  private sawDisconnect = false;
  private readonly onChargingChange = () => {
    this.updateChargingState(this.battery?.charging ?? false);
  };

  async ngOnInit(): Promise<void> {
    await this.setupBatteryListener();
  }

  ngOnDestroy(): void {
    if (this.battery) {
      this.battery.removeEventListener('chargingchange', this.onChargingChange);
    }
  }

  getTitle(): string {
    return 'Connect to power';
  }

  getInstructions(): string {
    if (this.task().requireConnect && this.task().requireDisconnect) {
      return 'Disconnect and reconnect the charger.';
    }
    if (this.task().requireConnect) {
      return 'Connect the device to a charger.';
    }
    if (this.task().requireDisconnect) {
      return 'Disconnect the charger.';
    }
    return '';
  }

  private async setupBatteryListener(): Promise<void> {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManagerLike> };
    if (!nav.getBattery) {
      this.statusText = 'No battery API found on this device.';
      return;
    }

    this.battery = await nav.getBattery();
    this.battery.addEventListener('chargingchange', this.onChargingChange);
    this.updateChargingState(this.battery.charging);
  }

  private updateChargingState(charging: boolean): void {
    const wasCharging = this.isCharging;
    this.isCharging = charging;

    if (!wasCharging && charging) {
      this.sawConnect = true;
    }
    if (wasCharging && !charging) {
      this.sawDisconnect = true;
    }

    this.statusText = charging ? 'Charging detected.' : 'Not charging.';

    const requiresConnect = this.task().requireConnect;
    const requiresDisconnect = this.task().requireDisconnect;
    const connectDone = !requiresConnect || this.sawConnect || charging;
    const disconnectDone = !requiresDisconnect || this.sawDisconnect || !charging;

    if (connectDone && disconnectDone) {
      this.taskSolved.emit();
    }
  }
}
